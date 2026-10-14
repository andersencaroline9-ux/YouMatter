ALTER TABLE `strengths_entries` ADD `contribution_sequence` integer;--> statement-breakpoint
WITH eligible AS (
  SELECT
    s.id,
    ROW_NUMBER() OVER (
      ORDER BY COALESCE(s.approved_at, s.created_at), s.id
    ) AS sequence
  FROM strengths_entries AS s
  WHERE s.status = 'approved'
    AND CASE
      WHEN json_valid(s.strength) THEN
        json_type(s.strength) = 'array'
        AND json_array_length(s.strength) = 3
        AND (
          SELECT COUNT(DISTINCT j.value)
          FROM json_each(s.strength) AS j
          WHERE j.type = 'text'
            AND j.value IN (
              'Creativity',
              'Curiosity',
              'Judgment',
              'Love of Learning',
              'Perspective',
              'Bravery',
              'Perseverance',
              'Honesty',
              'Zest',
              'Love',
              'Kindness',
              'Social Intelligence',
              'Teamwork',
              'Fairness',
              'Leadership',
              'Forgiveness',
              'Humility',
              'Prudence',
              'Self-Regulation',
              'Appreciation of Beauty & Excellence',
              'Gratitude',
              'Hope',
              'Humor',
              'Spirituality'
            )
        ) = 3
      ELSE 0
    END
)
UPDATE strengths_entries
SET contribution_sequence = (
  SELECT eligible.sequence
  FROM eligible
  WHERE eligible.id = strengths_entries.id
)
WHERE id IN (SELECT id FROM eligible);--> statement-breakpoint
CREATE UNIQUE INDEX `strengths_entries_contribution_sequence_unique` ON `strengths_entries` (`contribution_sequence`);