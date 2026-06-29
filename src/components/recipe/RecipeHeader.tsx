// src/components/recipe/RecipeHeader.tsx
// Top section: title (Kaisei Decol display), tagline, image, meta strip.
// Left 3/4 text, right 1/4 image block — mirrors spicy-ninja card layout.

import { useState } from "react";
import type { ZoneName } from "../../lib/scenes";
import { ZONE_ACCENTS } from "../../lib/scenes";

interface Props {
  title: string;
  tagline: string;
  serves: string;
  time: string;
  imageUrl?: string;
  imageAlt?: string;
  addedAt?: string;
  source?: string;
  zone: ZoneName;
}

export function RecipeHeader({
  title,
  tagline,
  serves,
  time,
  imageUrl,
  imageAlt,
  addedAt,
  source,
  zone,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const accent = ZONE_ACCENTS[zone];
  const resolvedImg = !imgError && imageUrl ? imageUrl : undefined;

  return (
    <header
      className="recipe-header"
      style={{ "--zone-accent": accent.accent } as React.CSSProperties}
    >
      <div className="recipe-header__inner">
        {/* ── Text block ──────────────────────────────────────────────── */}
        <div className="recipe-header__text">
          <span className="eyebrow" style={{ color: accent.accent }}>
            {ZONE_ACCENTS[zone].kanji} &nbsp; Recipe
          </span>
          <h1 className="recipe-title">{title}</h1>
          {tagline && <p className="recipe-tagline">{tagline}</p>}

          {/* Meta strip */}
          <dl className="recipe-meta">
            <div className="recipe-meta__item">
              <dt>Serves</dt>
              <dd>{serves}</dd>
            </div>
            <div className="recipe-meta__item">
              <dt>Time</dt>
              <dd>{time}</dd>
            </div>
            {source && (
              <div className="recipe-meta__item">
                <dt>Source</dt>
                <dd>
                  {isUrl(source) ? (
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="recipe-meta__link"
                    >
                      {trimUrl(source)}
                    </a>
                  ) : (
                    source
                  )}
                </dd>
              </div>
            )}
            {addedAt && (
              <div className="recipe-meta__item">
                <dt>Added</dt>
                <dd>
                  <time dateTime={addedAt}>{fmtDate(addedAt)}</time>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* ── Image block ─────────────────────────────────────────────── */}
        <div className="recipe-header__image-wrap">
          {resolvedImg ? (
            <img
              src={resolvedImg}
              alt={imageAlt ?? title}
              className="recipe-header__image"
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="recipe-header__image-placeholder" aria-hidden="true">
              {/* Shuriken placeholder */}
              <svg viewBox="0 0 80 80" style={{ width: 64, height: 64, opacity: 0.18 }}>
                <polygon
                  points="40,4 46,34 76,40 46,46 40,76 34,46 4,40 34,34"
                  fill="var(--cinnabar)"
                />
                <circle cx="40" cy="40" r="8" fill="var(--bg-primary)" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .recipe-header {
          padding: 3rem 3.5rem 2rem;
          border-bottom: 1px solid var(--border);
        }
        .recipe-header__inner {
          display: grid;
          grid-template-columns: 3fr 1fr;
          gap: 2rem;
          align-items: start;
          max-width: 900px;
        }
        .recipe-title {
          font-family: "Kaisei Decol", serif;
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: var(--text-primary);
          line-height: 1;
          letter-spacing: -0.01em;
          margin-bottom: 1rem;
        }
        .recipe-tagline {
          font-family: "Shippori Mincho", serif;
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.75;
          max-width: 55ch;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .recipe-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0 2rem;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }
        .recipe-meta__item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .recipe-meta__item dt {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-ghost);
        }
        .recipe-meta__item dd {
          font-family: "Shippori Mincho", serif;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .recipe-meta__link {
          color: var(--zone-accent, var(--cinnabar));
          text-decoration: none;
        }
        .recipe-meta__link:hover { text-decoration: underline; }
        .recipe-header__image-wrap {
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .recipe-header__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .recipe-header__image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        @media (max-width: 768px) {
          .recipe-header { padding: 1.5rem; }
          .recipe-header__inner {
            grid-template-columns: 1fr;
          }
          .recipe-header__image-wrap { display: none; }
        }
      `}</style>
    </header>
  );
}

function isUrl(s: string) {
  return /^https?:\/\//i.test(s);
}
function trimUrl(s: string) {
  try {
    return new URL(s).hostname;
  } catch {
    return s;
  }
}
function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
