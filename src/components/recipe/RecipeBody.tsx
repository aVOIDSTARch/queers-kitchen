// src/components/recipe/RecipeBody.tsx
// Controls, Ingredients, Instructions, Notes, Footer — all styled
// with the spicy-ninja design system.

import { useState, useId } from "react";
import type {
  NotesSectionProps,
  IngredientGroupProps,
  StepCardProps,
  NoteItemProps,
} from "../../../recipe-parser";
import type { MeasurementSystem } from "../../lib/scenes";
import { displayQty } from "../../lib/ingredientQty";

// ─── Controls ─────────────────────────────────────────────────────────────────

interface ControlsProps {
  measurementSystem: MeasurementSystem;
  onMeasurementSystemChange: (s: MeasurementSystem) => void;
  scaleFactor: number;
  baseServes: string;
  onScaleFactorChange: (f: number) => void;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  zoneAccent: string;
}

export function Controls({
  measurementSystem,
  onMeasurementSystemChange,
  scaleFactor,
  baseServes,
  onScaleFactorChange,
  minScale = 0.25,
  maxScale = 8,
  scaleStep = 0.5,
  zoneAccent,
}: ControlsProps) {
  const id = useId();
  const canDec = scaleFactor - scaleStep >= minScale;
  const canInc = scaleFactor + scaleStep <= maxScale;

  const servesLabel = scaleServes(baseServes, scaleFactor);

  return (
    <div className="recipe-controls" style={{ "--zone-accent": zoneAccent } as React.CSSProperties}>
      {/* Measurement toggle */}
      <fieldset className="controls-toggle">
        <legend>Measurements</legend>
        {(["english", "metric"] as MeasurementSystem[]).map((sys) => (
          <label
            key={sys}
            className={`controls-toggle__opt${measurementSystem === sys ? " active" : ""}`}
          >
            <input
              type="radio"
              name={`${id}-sys`}
              value={sys}
              checked={measurementSystem === sys}
              onChange={() => onMeasurementSystemChange(sys)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
            {sys.charAt(0).toUpperCase() + sys.slice(1)}
          </label>
        ))}
      </fieldset>

      {/* Serving adjuster */}
      <div className="controls-serves" role="group" aria-label="Serving size">
        <button
          className="controls-serves__btn"
          onClick={() => onScaleFactorChange(parseFloat((scaleFactor - scaleStep).toFixed(2)))}
          disabled={!canDec}
          aria-label="Decrease servings"
        >
          −
        </button>

        <output className="controls-serves__display" aria-live="polite">
          {servesLabel}
          {scaleFactor !== 1 && (
            <span className="controls-serves__factor">{formatFactor(scaleFactor)}×</span>
          )}
        </output>

        <button
          className="controls-serves__btn"
          onClick={() => onScaleFactorChange(parseFloat((scaleFactor + scaleStep).toFixed(2)))}
          disabled={!canInc}
          aria-label="Increase servings"
        >
          +
        </button>

        {scaleFactor !== 1 && (
          <button
            className="controls-serves__reset btn-ghost"
            onClick={() => onScaleFactorChange(1)}
          >
            Reset
          </button>
        )}
      </div>

      <style>{`
        .recipe-controls {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          padding: 1rem 3.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .controls-toggle {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--border);
          padding: 0;
          border-radius: 0;
        }
        .controls-toggle legend {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-ghost);
          padding: 0 0.5rem;
        }
        .controls-toggle__opt {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          cursor: pointer;
          color: var(--text-muted);
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .controls-toggle__opt.active {
          color: var(--zone-accent, var(--cinnabar));
          border-color: var(--zone-accent, var(--cinnabar));
          background: rgba(227,66,52,0.08);
        }
        .controls-serves {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .controls-serves__btn {
          width: 32px; height: 32px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-size: 1.2rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .controls-serves__btn:hover:not(:disabled) {
          border-color: var(--zone-accent, var(--cinnabar));
          color: var(--zone-accent, var(--cinnabar));
        }
        .controls-serves__btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .controls-serves__display {
          font-family: "Kaisei Decol", serif;
          font-size: 1rem;
          color: var(--text-primary);
          min-width: 5rem;
          text-align: center;
        }
        .controls-serves__factor {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.6rem;
          color: var(--zone-accent, var(--cinnabar));
          margin-left: 0.4rem;
          letter-spacing: 0.1em;
        }
        .controls-serves__reset {
          font-size: 0.58rem;
          padding: 0.3rem 0.8rem;
        }
        @media (max-width: 768px) {
          .recipe-controls { padding: 0.8rem 1.2rem; gap: 1rem; }
        }
      `}</style>
    </div>
  );
}

// ─── Ingredients ──────────────────────────────────────────────────────────────

interface IngredientsProps {
  groups: IngredientGroupProps[];
  totalCount: number;
  measurementSystem: MeasurementSystem;
  scaleFactor: number;
  zoneAccent: string;
}

export function Ingredients({
  groups,
  totalCount,
  measurementSystem,
  scaleFactor,
  zoneAccent,
}: IngredientsProps) {
  return (
    <section
      className="recipe-ingredients"
      style={{ "--zone-accent": zoneAccent } as React.CSSProperties}
    >
      <h2 className="recipe-section-heading">
        Ingredients
        <span className="recipe-section-count">({totalCount})</span>
      </h2>

      {groups.map((group) => (
        <div key={group.groupIndex} className="ingredient-group">
          {group.groupName && <h3 className="ingredient-group__name">{group.groupName}</h3>}
          <ul className="ingredient-list">
            {group.ingredients.map((row) => (
              <li key={row.index} className="ingredient-row" data-index={row.index}>
                {row.qty && (
                  <span className="ingredient-qty">
                    {displayQty(row.qty, scaleFactor, measurementSystem)}
                  </span>
                )}
                <span className="ingredient-name">{row.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <style>{`
        .recipe-ingredients {
          padding: 2rem 2rem 2rem 3.5rem;
        }
        .recipe-section-heading {
          font-family: "Kaisei Decol", serif;
          font-weight: 400;
          font-size: 1.1rem;
          color: var(--text-primary);
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .recipe-section-count {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--text-ghost);
        }
        .ingredient-group { margin-bottom: 1.5rem; }
        .ingredient-group__name {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.58rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--zone-accent, var(--cinnabar));
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--border);
        }
        .ingredient-list { list-style: none; }
        .ingredient-row {
          display: grid;
          grid-template-columns: 5rem 1fr;
          gap: 0.5rem;
          padding: 0.45rem 0;
          border-bottom: 1px solid var(--border);
          font-family: "Shippori Mincho", serif;
          font-size: 0.9rem;
        }
        .ingredient-row:last-child { border-bottom: none; }
        .ingredient-qty {
          color: var(--text-muted);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.8rem;
          padding-top: 0.05rem;
        }
        .ingredient-name { color: var(--text-secondary); }
        @media (max-width: 768px) {
          .recipe-ingredients { padding: 1.5rem; }
        }
      `}</style>
    </section>
  );
}

// ─── Instructions ─────────────────────────────────────────────────────────────

interface InstructionsProps {
  steps: StepCardProps[];
  totalSteps: number;
  completedSteps: Set<number>;
  onStepToggle: (i: number) => void;
  zoneAccent: string;
}

export function Instructions({
  steps,
  totalSteps,
  completedSteps,
  onStepToggle,
  zoneAccent,
}: InstructionsProps) {
  const completedCount = completedSteps.size;

  return (
    <section
      className="recipe-instructions"
      style={{ "--zone-accent": zoneAccent } as React.CSSProperties}
    >
      <h2 className="recipe-section-heading">
        Method
        {completedCount > 0 && (
          <span className="recipe-section-count" aria-live="polite">
            {completedCount}/{totalSteps}
          </span>
        )}
      </h2>

      <ol className="step-list">
        {steps.map((step) => {
          const done = completedSteps.has(step.index);
          return (
            <li
              key={step.index}
              className={`step${done ? " step--done" : ""}`}
              data-index={step.index}
            >
              <button
                className="step__toggle"
                role="checkbox"
                aria-checked={done}
                onClick={() => onStepToggle(step.index)}
                aria-label={
                  done
                    ? `Mark step ${step.index + 1} incomplete`
                    : `Mark step ${step.index + 1} complete`
                }
              >
                {done ? "✓" : <span>{step.stepNumber ?? step.index + 1}</span>}
              </button>
              <div className="step__content">
                <h3 className="step__title">{step.title}</h3>
                <p className="step__body">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {completedCount === totalSteps && totalSteps > 0 && (
        <p className="step-complete" role="status" aria-live="polite">
          All steps complete — enjoy.
        </p>
      )}

      <style>{`
        .recipe-instructions { padding: 2rem 3.5rem 2rem 2rem; }
        .step-list { list-style: none; }
        .step {
          display: grid;
          grid-template-columns: 2.5rem 1fr;
          gap: 1rem;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border);
          transition: opacity 0.2s ease;
        }
        .step:last-child { border-bottom: none; }
        .step--done { opacity: 0.45; }
        .step__toggle {
          width: 2rem; height: 2rem; flex-shrink: 0;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.75rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          margin-top: 0.15rem;
        }
        .step__toggle:hover {
          border-color: var(--zone-accent, var(--cinnabar));
          color: var(--zone-accent, var(--cinnabar));
        }
        .step--done .step__toggle {
          background: var(--zone-accent, var(--cinnabar));
          border-color: var(--zone-accent, var(--cinnabar));
          color: var(--ink);
        }
        .step__title {
          font-family: "Kaisei Decol", serif;
          font-weight: 400;
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .step__body {
          font-family: "Shippori Mincho", serif;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }
        .step-complete {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--zone-accent, var(--cinnabar));
          padding: 1rem 0;
        }
        @media (max-width: 768px) {
          .recipe-instructions { padding: 1.5rem; }
        }
      `}</style>
    </section>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────

interface CookNote {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesProps {
  editorialNotes: NotesSectionProps;
  cookNotes: CookNote[];
  onAddNote: (body: string) => void;
  onUpdateNote: (id: string, body: string) => void;
  onDeleteNote: (id: string) => void;
  zoneAccent: string;
}

export function Notes({
  editorialNotes,
  cookNotes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  zoneAccent,
}: NotesProps) {
  const [draft, setDraft] = useState("");
  const textId = useId();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = draft.trim();
    if (t) {
      onAddNote(t);
      setDraft("");
    }
  }

  return (
    <aside className="recipe-notes" style={{ "--zone-accent": zoneAccent } as React.CSSProperties}>
      {/* Editorial notes from markdown */}
      {editorialNotes.notes.length > 0 && (
        <section className="notes-editorial">
          <h2 className="recipe-section-heading">Notes</h2>
          <dl className="notes-editorial__list">
            {editorialNotes.notes.map((note: NoteItemProps) => (
              <div key={note.index} className="notes-editorial__item">
                {note.label && <dt className="notes-editorial__label">{note.label}</dt>}
                <dd className="notes-editorial__body">{note.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Cook notes */}
      <section className="notes-cook">
        <h2 className="recipe-section-heading">Your Notes</h2>

        {cookNotes.length > 0 && (
          <ul className="cook-notes-list" aria-live="polite">
            {cookNotes.map((note) => (
              <CookNoteItem
                key={note.id}
                note={note}
                onUpdate={onUpdateNote}
                onDelete={onDeleteNote}
              />
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className="notes-add-form" noValidate>
          <label htmlFor={textId} className="notes-add-form__label">
            Add a note
          </label>
          <textarea
            id={textId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                const t = draft.trim();
                if (t) {
                  onAddNote(t);
                  setDraft("");
                }
              }
            }}
            placeholder="Your substitutions, timing notes, adjustments…"
            rows={3}
            className="notes-add-form__textarea"
          />
          <div className="notes-add-form__row">
            <button
              type="submit"
              className="btn-primary notes-add-form__btn"
              disabled={!draft.trim()}
            >
              Save note
            </button>
            <span className="notes-add-form__hint">⌘ Enter to save</span>
          </div>
        </form>
      </section>

      <style>{`
        .recipe-notes {
          padding: 2rem 3.5rem;
          border-top: 1px solid var(--border);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }
        .notes-editorial__list { }
        .notes-editorial__item {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .notes-editorial__item:last-child { border-bottom: none; }
        .notes-editorial__label {
          font-family: "Kaisei Decol", serif;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--zone-accent, var(--cinnabar));
          margin-bottom: 0.3rem;
        }
        .notes-editorial__body {
          font-family: "Shippori Mincho", serif;
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.7;
        }
        .cook-notes-list { list-style: none; margin-bottom: 1.5rem; }
        .notes-add-form__label {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--text-ghost);
          display: block;
          margin-bottom: 0.5rem;
        }
        .notes-add-form__textarea {
          width: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: "Shippori Mincho", serif;
          font-size: 0.9rem;
          padding: 0.75rem;
          resize: vertical;
          min-height: 4rem;
          transition: border-color 0.2s ease;
        }
        .notes-add-form__textarea:focus {
          outline: none;
          border-color: var(--zone-accent, var(--cinnabar));
        }
        .notes-add-form__row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .notes-add-form__btn { padding: 0.5rem 1.5rem; }
        .notes-add-form__hint {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.15em;
          color: var(--text-ghost);
        }
        @media (max-width: 768px) {
          .recipe-notes {
            grid-template-columns: 1fr;
            padding: 1.5rem;
            gap: 2rem;
          }
        }
      `}</style>
    </aside>
  );
}

function CookNoteItem({
  note,
  onUpdate,
  onDelete,
}: {
  note: CookNote;
  onUpdate: (id: string, body: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.body);
  const textId = useId();

  function save() {
    const t = draft.trim();
    if (t && t !== note.body) onUpdate(note.id, t);
    setEditing(false);
  }

  return (
    <li className="cook-note">
      {editing ? (
        <div className="cook-note__edit">
          <label htmlFor={textId} style={{ display: "none" }}>
            Edit note
          </label>
          <textarea
            id={textId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setDraft(note.body);
                setEditing(false);
              }
            }}
            autoFocus
            rows={3}
            className="notes-add-form__textarea"
          />
          <div className="cook-note__actions">
            <button
              className="btn-primary cook-note__save-btn"
              onClick={save}
              disabled={!draft.trim()}
            >
              Save
            </button>
            <button
              className="btn-ghost cook-note__cancel-btn"
              onClick={() => {
                setDraft(note.body);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="cook-note__view">
          <p className="cook-note__body">{note.body}</p>
          <div className="cook-note__meta-row">
            <time className="cook-note__time" dateTime={note.createdAt}>
              {fmtDate(note.createdAt)}
            </time>
            <div className="cook-note__btns">
              <button className="cook-note__btn" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button
                className="cook-note__btn cook-note__btn--del"
                onClick={() => onDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .cook-note {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
        }
        .cook-note:last-child { border-bottom: none; }
        .cook-note__body {
          font-family: "Shippori Mincho", serif;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 0.4rem;
        }
        .cook-note__meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cook-note__time {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.15em;
          color: var(--text-ghost);
        }
        .cook-note__btns { display: flex; gap: 0.75rem; }
        .cook-note__btn {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-ghost);
          background: none; border: none; cursor: pointer;
          padding: 0;
          transition: color 0.2s ease;
        }
        .cook-note__btn:hover { color: var(--text-primary); }
        .cook-note__btn--del:hover { color: var(--cinnabar); }
        .cook-note__actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
        .cook-note__save-btn,
        .cook-note__cancel-btn { padding: 0.4rem 1rem; }
      `}</style>
    </li>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

interface FooterProps {
  tags: string[];
  buildTagHref?: (tag: string) => string;
  zoneAccent: string;
}

export function RecipeFooter({ tags, buildTagHref, zoneAccent }: FooterProps) {
  return (
    <footer
      className="recipe-footer"
      style={{ "--zone-accent": zoneAccent } as React.CSSProperties}
    >
      {tags.length > 0 && (
        <nav className="recipe-tags" aria-label="Recipe tags">
          <ul className="recipe-tags__list" role="list">
            {tags.map((tag) => (
              <li key={tag}>
                {buildTagHref ? (
                  <a href={buildTagHref(tag)} className="recipe-tag" rel="tag">
                    {tag}
                  </a>
                ) : (
                  <span className="recipe-tag">{tag}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="recipe-footer__brand">
        <span aria-hidden="true">©</span> {new Date().getFullYear()} Queers Kitchen Cooperative
        <abbr title="Trademark" aria-label="trademark">
          ™
        </abbr>
      </p>

      <style>{`
        .recipe-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.25rem 3.5rem;
          border-top: 1px solid var(--border);
          background: var(--bg-secondary);
        }
        .recipe-tags__list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          list-style: none;
        }
        .recipe-tag {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--border);
          color: var(--text-ghost);
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        a.recipe-tag:hover {
          border-color: var(--zone-accent, var(--cinnabar));
          color: var(--zone-accent, var(--cinnabar));
        }
        .recipe-footer__brand {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.52rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-ghost);
          white-space: nowrap;
        }
        .recipe-footer__brand abbr {
          text-decoration: none;
          font-size: 0.65em;
          vertical-align: super;
        }
        @media (max-width: 768px) {
          .recipe-footer { padding: 1rem 1.5rem; }
        }
      `}</style>
    </footer>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function scaleServes(base: string, factor: number): string {
  const range = base.match(/^(\d+)\s*[–-]\s*(\d+)(.*)/);
  if (range) {
    const lo = Math.round(parseInt(range[1]) * factor);
    const hi = Math.round(parseInt(range[2]) * factor);
    return `${lo}–${hi}${range[3]}`;
  }
  const single = base.match(/^(\d+)(.*)/);
  if (single) return `${Math.round(parseInt(single[1]) * factor)}${single[2]}`;
  return base;
}

function formatFactor(f: number): string {
  const m: Record<number, string> = { 0.25: "¼", 0.5: "½", 0.75: "¾", 1.5: "1½", 2.5: "2½" };
  return m[f] ?? String(f);
}

export type { CookNote, MeasurementSystem };
