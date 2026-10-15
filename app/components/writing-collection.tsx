"use client";

import Image from "next/image";
import Link from "next/link";
import { writingChapters, writingPieces } from "../lib/writing-metadata";

export default function WritingCollection() {
  return (
    <div className="writing-collection">
      <section
        className="writing-collection-intro"
        aria-labelledby="writing-collection-title"
      >
        <div className="writing-section-heading">
          <div>
            <p className="writing-eyebrow">The collection</p>
            <h2 id="writing-collection-title">Twenty pieces. Six chapters.</h2>
            <p className="writing-collection-intro__copy">
              A collection of writing from over the years — including pieces
              originally written as The Mommy Poet and excerpts from my book,{" "}
              <em>You Matter. But This Isn&apos;t About You.</em>
            </p>
          </div>
        </div>

        <div className="writing-chapters">
          {writingChapters.map((chapter) => {
            const pieces = writingPieces
              .filter((piece) => piece.chapter === chapter.number)
              .sort((a, b) => a.chapterOrder - b.chapterOrder);

            return (
              <section
                key={chapter.number}
                className={`writing-chapter writing-chapter--${chapter.number}`}
                aria-labelledby={`writing-chapter-${chapter.number}`}
              >
                <figure className="writing-chapter__image">
                  {chapter.image ? (
                    <Image
                      src={chapter.image.src}
                      alt={chapter.image.alt}
                      width={chapter.image.width}
                      height={chapter.image.height}
                      unoptimized
                    />
                  ) : (
                    <div
                      className="writing-chapter__placeholder"
                      role="img"
                      aria-label={`Photograph to be added for ${chapter.title}. ${chapter.imageBrief}`}
                    >
                      <span>Chapter photograph to come</span>
                    </div>
                  )}
                </figure>

                <div className="writing-chapter__content">
                  <header className="writing-chapter__heading">
                    <p className="writing-chapter__number">
                      Chapter {String(chapter.number).padStart(2, "0")}
                    </p>
                    <h3 id={`writing-chapter-${chapter.number}`}>
                      {chapter.title}
                    </h3>
                    <p className="writing-chapter__description">
                      {chapter.description}
                    </p>
                  </header>

                  <ol className="writing-chapter__stories">
                    {pieces.map((piece) => {
                      const treatment =
                        piece.chapterOrder === 1
                          ? "lead"
                          : piece.chapterOrder === pieces.length &&
                              pieces.length >= 4
                            ? "quiet"
                            : "standard";

                      return (
                        <li
                          key={piece.slug}
                          className={`writing-chapter__story writing-chapter__story--${treatment}`}
                        >
                          <Link href={`/writing/${piece.slug}`}>
                            <span className="writing-chapter__story-title">
                              {piece.title}
                            </span>
                            <span className="writing-chapter__read">
                              Read story <span aria-hidden="true">→</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
