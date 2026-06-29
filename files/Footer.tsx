/**
 * Footer.tsx
 * Spans the full width at the bottom of Recipe.tsx.
 * Left side: tag list (each tag is a navigable element for filtering).
 * Right side: "© {year} Queers Kitchen Cooperative™"
 *
 * The ™ is rendered as a proper <abbr> with a title so screen readers and
 * hover tooltips surface the expansion. The © symbol uses the HTML entity
 * rather than the Unicode character so encoding is unambiguous.
 *
 * Tags are rendered as <a> elements by default so they participate in
 * site navigation. If no href builder is supplied they render as <span>
 * with a data attribute for CSS targeting, keeping the component usable
 * even without a router.
 */

import React from "react";
import type { FooterProps } from "../types/recipe-component-types";

interface FooterPropsExtended extends FooterProps {
  /**
   * Optional function that converts a tag string to its href.
   * e.g., (tag) => `/recipes?tag=${encodeURIComponent(tag)}`
   * When omitted, tags render as non-interactive spans.
   */
  buildTagHref?: (tag: string) => string;
}

export function Footer({
  tags,
  copyrightYear,
  buildTagHref,
}: FooterPropsExtended): React.ReactElement {
  const year = copyrightYear ?? new Date().getFullYear();

  return (
    <footer aria-label="Recipe footer" data-component="Footer">
      {/* ── Tag list ────────────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <nav aria-label="Recipe tags" data-element="tag-nav">
          <ul data-element="tag-list" role="list">
            {tags.map((tag) => (
              <li key={tag} data-element="tag-item">
                {buildTagHref ? (
                  <a href={buildTagHref(tag)} data-element="tag-link" rel="tag">
                    {tag}
                  </a>
                ) : (
                  <span data-element="tag-label">{tag}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* ── Branding ────────────────────────────────────────────────────── */}
      <p
        aria-label={`Copyright ${year} Queers Kitchen Cooperative, trademark`}
        data-element="branding"
      >
        <span data-element="circa" aria-hidden="true">
          ©
        </span>
        <span data-element="year">{year}</span>{" "}
        <span data-element="name">Queers Kitchen Cooperative</span>
        <abbr title="Trademark" data-element="trademark" aria-label="trademark">
          ™
        </abbr>
      </p>
    </footer>
  );
}
