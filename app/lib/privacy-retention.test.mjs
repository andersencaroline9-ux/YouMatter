import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import {
  deleteContactMessage,
  deleteReconnectInterest,
  deleteRejectedTextContribution,
  pendingContributionCutoffTimestamp,
  purgeExpiredContactMessages,
  purgeExpiredReconnectInterests,
  purgeStalePendingContributions,
  retentionCutoffTimestamp,
} from "./privacy-retention.ts";
import { createVisitorSubmissionIdentity } from "./visitor-submissions.ts";

const NOW = new Date("2026-10-31T12:00:00.000Z");
const CUTOFF_90_DAYS = "2026-08-02 12:00:00";
const CUTOFF_12_MONTHS = "2025-10-31 12:00:00";
const PENDING_TABLES = [
  "gratitudes",
  "kindness_entries",
  "strengths_entries",
  "dream_submissions",
  "homepage_checkins",
];

class SqliteD1Statement {
  constructor(database, query) {
    this.database = database;
    this.query = query;
    this.values = [];
  }

  bind(...values) {
    this.values = values;
    return this;
  }

  all() {
    return {
      results: this.database.prepare(this.query).all(...this.values),
    };
  }

  first() {
    return this.database.prepare(this.query).get(...this.values) ?? null;
  }

  run() {
    return this.database.prepare(this.query).run(...this.values);
  }
}

class SqliteD1 {
  constructor() {
    this.sqlite = new DatabaseSync(":memory:");
    for (const table of PENDING_TABLES) {
      this.sqlite.exec(
        `CREATE TABLE ${table} (
          id INTEGER PRIMARY KEY,
          submission_id TEXT,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL
        )`
      );
    }
    this.sqlite.exec(
      `CREATE TABLE live_adventure_interests (
        id INTEGER PRIMARY KEY,
        created_at TEXT NOT NULL
      );
      CREATE TABLE contact_messages (
        id INTEGER PRIMARY KEY,
        created_at TEXT NOT NULL
      );`
    );
  }

  prepare(query) {
    return new SqliteD1Statement(this.sqlite, query);
  }

  close() {
    this.sqlite.close();
  }
}

function insert(db, table, values) {
  const statement = db.sqlite.prepare(
    `INSERT INTO ${table} (submission_id, status, created_at) VALUES (?, ?, ?)`
  );
  return statement.run(...values);
}

test("rejecting each text contribution physically deletes it without changing approved totals", async () => {
  const db = new SqliteD1();
  try {
    const approvedGratitude = "approved-gratitude";
    const rejectedGratitude = "rejected-gratitude";
    for (let index = 0; index < 3; index += 1) {
      insert(db, "gratitudes", [
        approvedGratitude,
        "approved",
        "2026-10-01 00:00:00",
      ]);
      insert(db, "gratitudes", [
        rejectedGratitude,
        "pending",
        "2026-10-01 00:00:00",
      ]);
    }
    for (const table of PENDING_TABLES.slice(1)) {
      if (table === "kindness_entries") {
        for (let index = 0; index < 49; index += 1) {
          insert(db, table, [null, "approved", "2026-10-01 00:00:00"]);
        }
      }
      insert(db, table, [null, "pending", "2026-10-01 00:00:00"]);
    }

    const approvedTotal = () =>
      db.sqlite
        .prepare(
          `SELECT
            (SELECT COUNT(*) FROM kindness_entries WHERE status = 'approved') +
            (SELECT COUNT(DISTINCT submission_id) FROM gratitudes
             WHERE status = 'approved' AND submission_id IS NOT NULL) AS total`
        )
        .get().total;
    const beforeTotal = approvedTotal();
    assert.equal(beforeTotal, 50);

    const deletedGratitudes = await deleteRejectedTextContribution(
      db,
      "gratitude",
      1,
      rejectedGratitude
    );
    assert.equal(deletedGratitudes.length, 3);
    assert.equal(
      db.sqlite
        .prepare("SELECT COUNT(*) AS count FROM gratitudes WHERE submission_id = ?")
        .get(rejectedGratitude).count,
      0,
      "the complete grouped Gratitude submission is removed"
    );

    for (const [type, table] of [
      ["kindness", "kindness_entries"],
      ["strengths", "strengths_entries"],
      ["dreams", "dream_submissions"],
      ["checkins", "homepage_checkins"],
    ]) {
      const [{ id }] = db.sqlite
        .prepare(`SELECT id FROM ${table} WHERE status = 'pending'`)
        .all();
      const deletedIds = await deleteRejectedTextContribution(db, type, id);
      assert.deepEqual(deletedIds, [id]);
      assert.equal(
        db.sqlite
          .prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE id = ?`)
          .get(id).count,
        0,
        `${type} rejection removes its record`
      );
    }

    assert.equal(approvedTotal(), beforeTotal);
    assert.equal(Math.floor(approvedTotal() / 50), Math.floor(beforeTotal / 50));
    assert.equal(
      db.sqlite
        .prepare("SELECT COUNT(*) AS count FROM gratitudes WHERE status = 'approved'")
        .get().count,
      3,
      "the approved Gratitude group remains publicly eligible"
    );
  } finally {
    db.close();
  }
});

test("90-day pending purge deletes only records strictly older than its cutoff", async () => {
  const db = new SqliteD1();
  try {
    assert.equal(pendingContributionCutoffTimestamp(NOW), CUTOFF_90_DAYS);
    for (const table of PENDING_TABLES) {
      insert(db, table, [null, "pending", "2026-08-02 11:59:59"]);
      insert(db, table, [null, "pending", CUTOFF_90_DAYS]);
      insert(db, table, [null, "pending", "2026-08-02 12:00:01"]);
      insert(db, table, [null, "approved", "2026-01-01 00:00:00"]);
    }

    await purgeStalePendingContributions(db, NOW);

    for (const table of PENDING_TABLES) {
      assert.deepEqual(
        db.sqlite
          .prepare(`SELECT status, created_at FROM ${table} ORDER BY id`)
          .all()
          .map(({ status, created_at }) => ({ status, created_at })),
        [
          { status: "pending", created_at: CUTOFF_90_DAYS },
          { status: "pending", created_at: "2026-08-02 12:00:01" },
          { status: "approved", created_at: "2026-01-01 00:00:00" },
        ],
        `${table} keeps exact-cutoff and approved rows`
      );
    }
  } finally {
    db.close();
  }
});

test("RECONNECT and Contact retention use a 12-month cutoff and preserve the boundary", async () => {
  const db = new SqliteD1();
  try {
    assert.equal(retentionCutoffTimestamp(12, NOW), CUTOFF_12_MONTHS);
    for (const table of ["live_adventure_interests", "contact_messages"]) {
      const statement = db.sqlite.prepare(
        `INSERT INTO ${table} (created_at) VALUES (?)`
      );
      statement.run("2025-10-31 11:59:59");
      statement.run(CUTOFF_12_MONTHS);
      statement.run("2025-10-31 12:00:01");
    }

    await purgeExpiredReconnectInterests(db, NOW);
    await purgeExpiredContactMessages(db, NOW);

    for (const table of ["live_adventure_interests", "contact_messages"]) {
      assert.deepEqual(
        db.sqlite
          .prepare(`SELECT created_at FROM ${table} ORDER BY id`)
          .all()
          .map(({ created_at }) => ({ created_at })),
        [
          { created_at: CUTOFF_12_MONTHS },
          { created_at: "2025-10-31 12:00:01" },
        ]
      );
    }
  } finally {
    db.close();
  }
});

test("RECONNECT and Contact admin deletion physically remove the selected record", async () => {
  const db = new SqliteD1();
  try {
    const reconnectId = db.sqlite
      .prepare("INSERT INTO live_adventure_interests (created_at) VALUES (?)")
      .run("2026-10-01 00:00:00").lastInsertRowid;
    const contactId = db.sqlite
      .prepare("INSERT INTO contact_messages (created_at) VALUES (?)")
      .run("2026-10-01 00:00:00").lastInsertRowid;

    assert.equal(await deleteReconnectInterest(db, reconnectId), true);
    assert.equal(await deleteContactMessage(db, contactId), true);
    assert.equal(await deleteReconnectInterest(db, reconnectId), false);
    assert.equal(await deleteContactMessage(db, contactId), false);
    assert.equal(
      db.sqlite
        .prepare("SELECT COUNT(*) AS count FROM live_adventure_interests")
        .get().count,
      0
    );
    assert.equal(
      db.sqlite
        .prepare("SELECT COUNT(*) AS count FROM contact_messages")
        .get().count,
      0
    );
  } finally {
    db.close();
  }
});

test("visitor identity cookie expires after 90 days and keeps its security attributes", async () => {
  const identity = await createVisitorSubmissionIdentity(
    new Request("https://thisisyoumatter.com/api/kindness")
  );
  assert.match(identity.setCookie ?? "", /Max-Age=7776000/);
  assert.match(identity.setCookie ?? "", /__Host-youmatter-visitor=/);
  assert.match(identity.setCookie ?? "", / Secure;/);
  assert.match(identity.setCookie ?? "", / HttpOnly;/);
  assert.match(identity.setCookie ?? "", /SameSite=Lax/);
  assert.equal(identity.tokenHash.length > 0, true);
});
