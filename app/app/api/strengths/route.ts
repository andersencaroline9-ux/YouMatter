import { env } from "cloudflare:workers";
import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import { getDb } from "../../../db";
import { strengthsEntries } from "../../../db/schema";
import { normalizeCountryCode } from "../../../lib/countries";
import {
  isCharacterStrengthSelection,
  parseStoredCharacterStrengths,
  serializeCharacterStrengths,
} from "../../../lib/character-strengths";
import {
  createVisitorSubmissionIdentity,
  getVisitorTokenHash,
  privateVisitorJson,
} from "../../../lib/visitor-submissions";
import { purgeStalePendingContributions } from "../../../lib/privacy-retention";

const REFLECTION_MAX_LENGTH = 240;
const FIRST_NAME_MAX_LENGTH = 40;

export async function GET(request: Request) {
  try {
    await purgeStalePendingContributions(env.DB);
    const db = getDb();
    const approved = await db
      .select({
        strength: strengthsEntries.strength,
        reflection: strengthsEntries.reflection,
        displayName: strengthsEntries.displayName,
        countryCode: strengthsEntries.countryCode,
        sequence: strengthsEntries.contributionSequence,
        status: strengthsEntries.status,
        createdAt: strengthsEntries.createdAt,
        approvedAt: strengthsEntries.approvedAt,
      })
      .from(strengthsEntries)
      .where(
        and(
          eq(strengthsEntries.status, "approved"),
          isNotNull(strengthsEntries.contributionSequence)
        )
      )
      .orderBy(asc(strengthsEntries.contributionSequence))
      .limit(100);

    const ownerTokenHash = await getVisitorTokenHash(request);
    const ownPending = ownerTokenHash
      ? await db
          .select({
            strength: strengthsEntries.strength,
            reflection: strengthsEntries.reflection,
            displayName: strengthsEntries.displayName,
            countryCode: strengthsEntries.countryCode,
            sequence: strengthsEntries.contributionSequence,
            status: strengthsEntries.status,
            createdAt: strengthsEntries.createdAt,
            approvedAt: strengthsEntries.approvedAt,
          })
          .from(strengthsEntries)
          .where(
            and(
              eq(strengthsEntries.status, "pending"),
              eq(strengthsEntries.ownerTokenHash, ownerTokenHash)
            )
          )
          .orderBy(desc(strengthsEntries.id))
      : [];

    const toPublicContribution = ({
      strength,
      reflection,
      displayName,
      countryCode,
      sequence,
    }: (typeof approved)[number]) => ({
      strengths: parseStoredCharacterStrengths(strength),
      reflection,
      displayName,
      countryCode,
      sequence,
    });
    return privateVisitorJson({
      contributions: approved.map(toPublicContribution),
      pending: ownPending.map(toPublicContribution),
    });
  } catch {
    return Response.json(
      { error: "Your contributions are temporarily unavailable." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await purgeStalePendingContributions(env.DB);
    const body = (await request.json()) as {
      strengths?: unknown;
      reflection?: unknown;
      identityChoice?: unknown;
      firstName?: unknown;
      countryCode?: unknown;
      consent?: unknown;
    };

    if (!isCharacterStrengthSelection(body.strengths)) {
      return Response.json(
        { error: "Choose three different listed character strengths." },
        { status: 400 }
      );
    }

    if (
      body.reflection !== undefined &&
      body.reflection !== null &&
      typeof body.reflection !== "string"
    ) {
      return Response.json(
        { error: "The reflection must be text." },
        { status: 400 }
      );
    }
    const reflection =
      typeof body.reflection === "string" ? body.reflection.trim() : "";
    if (reflection.length > REFLECTION_MAX_LENGTH) {
      return Response.json(
        {
          error: `The reflection must be ${REFLECTION_MAX_LENGTH} characters or fewer.`,
        },
        { status: 400 }
      );
    }

    let displayName: string;
    if (body.identityChoice === "anonymous") {
      displayName = "Anonymous";
    } else if (body.identityChoice === "firstName") {
      const firstName =
        typeof body.firstName === "string" ? body.firstName.trim() : "";
      if (!firstName || firstName.length > FIRST_NAME_MAX_LENGTH) {
        return Response.json(
          { error: "Enter a first name of 40 characters or fewer." },
          { status: 400 }
        );
      }
      displayName = firstName;
    } else {
      return Response.json(
        { error: "Choose Anonymous or First name." },
        { status: 400 }
      );
    }

    const country = normalizeCountryCode(body.countryCode);
    if (!country.valid) {
      return Response.json(
        { error: "Please choose a country from the list." },
        { status: 400 }
      );
    }
    if (body.consent !== true) {
      return Response.json(
        { error: "Consent is required before sharing your contribution." },
        { status: 400 }
      );
    }

    const identity = await createVisitorSubmissionIdentity(request);
    const [contribution] = await getDb()
      .insert(strengthsEntries)
      .values({
        strength: serializeCharacterStrengths(body.strengths),
        reflection: reflection || null,
        displayName,
        countryCode: country.countryCode,
        ownerTokenHash: identity.tokenHash,
        status: "pending",
      })
      .returning({
        reflection: strengthsEntries.reflection,
        displayName: strengthsEntries.displayName,
        countryCode: strengthsEntries.countryCode,
        status: strengthsEntries.status,
      });

    return privateVisitorJson(
      {
        contribution: {
          strengths: body.strengths,
          reflection: contribution.reflection,
          displayName: contribution.displayName,
          countryCode: contribution.countryCode,
          sequence: null,
          status: contribution.status,
        },
      },
      { status: 201 },
      identity.setCookie
    );
  } catch {
    return Response.json(
      { error: "Unable to save this contribution right now. Please try again." },
      { status: 500 }
    );
  }
}
