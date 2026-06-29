/**
 * Ingredients.tsx
 * Left one-third column of the recipe body.
 * Renders one or more named ingredient groups, each as a labeled list.
 * Quantities reflect the active scaleFactor and measurementSystem passed
 * down from Recipe.tsx state via Controls.
 *
 * Measurement conversion is intentionally kept shallow here: the qty
 * strings arrive pre-formatted from the parser and scaling layer.
 * This component renders what it receives — it does not re-parse or
 * re-convert quantities itself.
 */

import React from "react";
import type { IngredientsProps } from "../types/recipe-component-types";
import type { IngredientGroupProps, IngredientRowProps } from "../types/types";

export function Ingredients({
  groups,
  totalCount,
  measurementSystem,
  scaleFactor,
}: IngredientsProps): React.ReactElement {
  return (
    <section
      aria-label="Ingredients"
      data-component="Ingredients"
      data-measurement-system={measurementSystem}
      data-scale-factor={scaleFactor}
    >
      <h2>
        Ingredients
        <span aria-label={`${totalCount} ingredients total`} data-element="count">
          ({totalCount})
        </span>
      </h2>

      {groups.map((group) => (
        <IngredientGroup key={group.groupIndex} group={group} />
      ))}
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function IngredientGroup({ group }: { group: IngredientGroupProps }): React.ReactElement {
  return (
    <div
      role="group"
      aria-label={group.groupName ?? "Ingredients"}
      data-element="ingredient-group"
      data-group-index={group.groupIndex}
    >
      {group.groupName && <h3 data-element="group-name">{group.groupName}</h3>}

      <ul data-element="ingredient-list">
        {group.ingredients.map((row) => (
          <IngredientRow key={row.index} row={row} />
        ))}
      </ul>
    </div>
  );
}

function IngredientRow({ row }: { row: IngredientRowProps }): React.ReactElement {
  return (
    <li data-element="ingredient-row" data-row-index={row.index}>
      {row.qty && (
        <span data-element="qty" aria-label="Quantity">
          {row.qty}
        </span>
      )}
      <span data-element="name">{row.name}</span>
    </li>
  );
}
