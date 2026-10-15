import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import { writingPieceBySlug, writingPieces } from "../../../lib/writing-metadata";
import {
  goldForEveryoneDanish,
  writingSource,
  type WritingParagraph,
  type WritingRun,
} from "../../../lib/writing-source";
import "../writing.css";

type WritingArticleProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return writingPieces.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = writingPieceBySlug.get(slug);
  if (!piece) return { title: "Writing — You Matter" };
  return {
    title: `${piece.title} — Writing — You Matter`,
    description: `${piece.provenance}. Read ${piece.title} in the You Matter writing collection.`,
  };
}

function findFormattingClose(text: string, marker: string, start: number) {
  for (let index = start; index < text.length; index += 1) {
    if (text[index] === "\\") {
      index += 1;
    } else if (text.startsWith(marker, index)) {
      return index;
    }
  }
  return -1;
}

function formatWritingRun(run: WritingRun): WritingRun[] {
  if (run.text === "***ou Matter***") {
    return [{ ...run, text: "You Matter", bold: true, italic: true }];
  }
  if (run.text === "\\*") {
    return [{ ...run, text: "" }];
  }

  const text = run.text.replace(/&#x20;/gi, " ").replace(/\\$/, "");
  const formatted: WritingRun[] = [];
  let plain = "";

  const flushPlain = () => {
    if (plain) formatted.push({ ...run, text: plain });
    plain = "";
  };

  for (let index = 0; index < text.length;) {
    if (text[index] === "\\" && text[index + 1] === "*") {
      plain += "*";
      index += 2;
      continue;
    }

    const marker = text.startsWith("***", index)
      ? "***"
      : text.startsWith("**", index)
        ? "**"
        : text[index] === "*"
          ? "*"
          : "";

    if (marker) {
      const close = findFormattingClose(text, marker, index + marker.length);
      if (close > index + marker.length) {
        flushPlain();
        formatted.push({
          ...run,
          text: text.slice(index + marker.length, close).replace(/\\\*/g, "*"),
          bold: run.bold || marker.length >= 2,
          italic: run.italic || marker.length === 1 || marker.length === 3,
        });
        index = close + marker.length;
        continue;
      }
    }

    plain += text[index];
    index += 1;
  }

  flushPlain();
  return formatted;
}

function ArticleParagraph({ paragraph, removeObjectMarker = false }: {
  paragraph: WritingParagraph;
  removeObjectMarker?: boolean;
}) {
  const runs = paragraph.runs.flatMap((run) =>
    formatWritingRun({
      ...run,
      text: removeObjectMarker ? run.text.replace(/\uFFFC/g, "") : run.text,
    })
  );
  if (!runs.some((run) => run.text.length > 0)) {
    return <p className="writing-article__spacer" aria-hidden="true" />;
  }
  return (
    <p>
      {runs.map((run, index) => {
        let content: React.ReactNode = run.text;
        if (run.italic) content = <em>{content}</em>;
        if (run.bold) content = <strong>{content}</strong>;
        return <span key={index}>{content}</span>;
      })}
    </p>
  );
}

function ArticleBody({ paragraphs, removeObjectMarker = false }: {
  paragraphs: readonly WritingParagraph[];
  removeObjectMarker?: boolean;
}) {
  return (
    <div className="writing-article__body">
      {paragraphs.map((paragraph, index) => (
        <ArticleParagraph
          key={index}
          paragraph={paragraph}
          removeObjectMarker={removeObjectMarker}
        />
      ))}
    </div>
  );
}

export default async function WritingArticlePage({ params }: WritingArticleProps) {
  const { slug } = await params;
  const piece = writingPieceBySlug.get(slug);
  if (!piece) notFound();

  const paragraphs = writingSource[piece.number];
  if (!paragraphs) notFound();

  const exploringPieces = piece.explore
    .map((exploreSlug) => writingPieceBySlug.get(exploreSlug))
    .filter((explorePiece): explorePiece is (typeof writingPieces)[number] =>
      Boolean(explorePiece)
    );

  return (
    <>
      <SiteHeader />
      <main className="writing-page writing-article-page">
        <Link className="writing-back" href="/writing">
          <span aria-hidden="true">←</span> Back to writing
        </Link>
        {piece.image && (
          <figure className="writing-article__image">
            <Image
              src={piece.image.src}
              alt={piece.image.alt}
              width={piece.image.width}
              height={piece.image.height}
              priority
              unoptimized
            />
          </figure>
        )}
        <header className="writing-article__header">
          <p className="writing-provenance">{piece.provenance}</p>
          <h1>{piece.title}</h1>
          <p className="writing-article__themes">{piece.sourceThemes.join(" · ")}</p>
          {piece.number === 3 && (
            <p className="writing-translation-note">
              Approved English translation. The original Danish appears
              separately below.
            </p>
          )}
        </header>

        <article aria-label={piece.title}>
          <ArticleBody
            paragraphs={paragraphs}
            removeObjectMarker={piece.number === 1 || piece.number === 2}
          />
        </article>

        {piece.number === 3 && (
          <details className="writing-danish">
            <summary>Read the original Danish</summary>
            <ArticleBody paragraphs={goldForEveryoneDanish} />
          </details>
        )}

        <section className="writing-explore" aria-labelledby="writing-explore-title">
          <p className="writing-eyebrow">Keep exploring</p>
          <h2 id="writing-explore-title">Keep exploring</h2>
          <ul>
            {exploringPieces.map((explorePiece) => (
              <li key={explorePiece.slug}>
                <Link href={`/writing/${explorePiece.slug}`}>
                  {explorePiece.title} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
            {piece.adventures?.map((adventure) => (
              <li key={adventure.href}>
                <Link href={adventure.href}>
                  {adventure.label} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
