/**
 * Instructions.tsx
 * Right two-thirds column of the recipe body.
 * Renders the ordered method steps. Each step can be ticked off by the cook;
 * completion state lives in Recipe.tsx and is passed down as a Set<number>.
 *
 * Steps that are completed are marked with aria-checked and a data attribute
 * so CSS can apply a visual treatment (strikethrough, dim, checkmark) without
 * any inline styles here.
 */

import React from "react";
import type { InstructionsProps } from "../types/recipe-component-types";
import type { StepCardProps } from "../types/types";

export function Instructions({
  steps,
  totalSteps,
  completedSteps,
  onStepToggle,
}: InstructionsProps): React.ReactElement {
  const completedCount = completedSteps.size;

  return (
    <section aria-label="Instructions" data-component="Instructions">
      <h2>
        Instructions
        {completedCount > 0 && (
          <span
            aria-label={`${completedCount} of ${totalSteps} steps completed`}
            aria-live="polite"
            data-element="progress"
          >
            {completedCount}/{totalSteps}
          </span>
        )}
      </h2>

      <ol data-element="step-list">
        {steps.map((step) => (
          <StepCard
            key={step.index}
            step={step}
            isCompleted={completedSteps.has(step.index)}
            onToggle={() => onStepToggle(step.index)}
          />
        ))}
      </ol>

      {completedCount === totalSteps && totalSteps > 0 && (
        <p role="status" aria-live="polite" data-element="completion-message">
          All steps complete. Enjoy.
        </p>
      )}
    </section>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────────

interface StepCardInternalProps {
  step: StepCardProps;
  isCompleted: boolean;
  onToggle: () => void;
}

function StepCard({ step, isCompleted, onToggle }: StepCardInternalProps): React.ReactElement {
  const stepLabel = step.stepNumber != null ? `Step ${step.stepNumber}: ${step.title}` : step.title;

  return (
    <li
      data-element="step"
      data-step-index={step.index}
      data-completed={isCompleted}
      data-last={step.isLast}
    >
      {/* Completion toggle */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        aria-label={
          isCompleted
            ? `Mark step ${step.index + 1} incomplete`
            : `Mark step ${step.index + 1} complete`
        }
        onClick={onToggle}
        data-element="step-toggle"
      >
        <span aria-hidden="true">
          {isCompleted ? "✓" : String(step.stepNumber ?? step.index + 1)}
        </span>
      </button>

      <div data-element="step-content">
        <h3 aria-label={stepLabel} data-element="step-title">
          {step.title}
        </h3>
        <p data-element="step-body">{step.body}</p>
      </div>
    </li>
  );
}
