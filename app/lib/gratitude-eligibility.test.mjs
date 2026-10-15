import assert from "node:assert/strict";
import test from "node:test";
import { countEligibleGratitudeGroups } from "./gratitude-eligibility.ts";

function rows(submissionId, status, count = 3, validMessageCount = count) {
  return [{ submissionId, status, count, validMessageCount }];
}

test("counts only complete approved groups with three nonblank messages", () => {
  const cases = [
    { name: "valid approved group", rows: rows("valid", "approved"), expected: 1 },
    { name: "incomplete group", rows: rows("incomplete", "approved", 2), expected: 0 },
    {
      name: "mixed-status group",
      rows: [
        ...rows("mixed", "approved", 2),
        ...rows("mixed", "pending", 1),
      ],
      expected: 0,
    },
    { name: "pending group", rows: rows("pending", "pending"), expected: 0 },
    { name: "rejected group", rows: rows("rejected", "rejected"), expected: 0 },
    { name: "legacy rows", rows: rows(null, "approved"), expected: 0 },
    {
      name: "approved group with a blank message",
      rows: rows("blank", "approved", 3, 2),
      expected: 0,
    },
  ];

  for (const example of cases) {
    assert.equal(
      countEligibleGratitudeGroups(example.rows),
      example.expected,
      example.name
    );
  }
});
