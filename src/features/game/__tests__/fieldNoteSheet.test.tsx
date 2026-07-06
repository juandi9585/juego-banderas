import { describe, it, expect } from 'vitest';
import { render, within } from '@testing-library/react';
import { FieldNoteSheet } from '../components/FieldNoteSheet';
import type { AnswerRecord, Country, QuizQuestion } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// La hoja "nota de campo" debe mostrar EXACTAMENTE 2 datos curiosos elegidos AL
// AZAR del pool (6 por país en el dataset ampliado). Estos tests ejercitan el
// comportamiento real del componente con Math.random (sin inyección), montándolo
// muchas veces: cada montaje re-muestrea (el padre usa key={question.id}).
// ─────────────────────────────────────────────────────────────────────────────

const country: Country = {
  code: 'fr',
  name: 'Francia',
  continent: 'Europa',
  region: 'Europa Occidental',
  capital: 'París',
  flag: '/flags/fr.svg',
  facts: [
    'Dato uno de Francia.',
    'Dato dos de Francia.',
    'Dato tres de Francia.',
    'Dato cuatro de Francia.',
    'Dato cinco de Francia.',
    'Dato seis de Francia.',
  ],
};

const question: QuizQuestion = {
  id: '0-fr',
  mode: 'flag-to-name',
  kind: 'multiple-choice',
  country,
  correctCode: 'fr',
};

const answer: AnswerRecord = {
  questionId: '0-fr',
  correct: true,
  correctCode: 'fr',
  givenCode: 'fr',
};

/** Devuelve los textos de los facts mostrados en un montaje de la hoja. */
function shownFactsOnce(): string[] {
  const { getByRole, unmount } = render(
    <FieldNoteSheet
      question={question}
      answer={answer}
      isLast={false}
      onNext={() => {}}
    />,
  );
  const dialog = getByRole('dialog');
  const items = within(dialog).getAllByRole('listitem').map((li) => li.textContent ?? '');
  unmount();
  return items;
}

describe('FieldNoteSheet — 2 datos al azar (§10.2)', () => {
  it('siempre muestra exactamente 2 facts, y siempre del pool del país', () => {
    const pool = new Set(country.facts);
    for (let i = 0; i < 60; i++) {
      const shown = shownFactsOnce();
      expect(shown).toHaveLength(2);
      // Ambos pertenecen al país (nunca inventa ni mezcla).
      shown.forEach((f) => expect(pool.has(f)).toBe(true));
      // Sin repetir el mismo fact dos veces (muestreo sin reemplazo).
      expect(new Set(shown).size).toBe(2);
    }
  });

  it('los 2 facts varían entre montajes (aleatoriedad real)', () => {
    const pairs = new Set<string>();
    for (let i = 0; i < 60; i++) {
      // Clave por par NO ordenado: dos montajes con los mismos 2 facts colisionan.
      pairs.add([...shownFactsOnce()].sort().join(' | '));
    }
    // Con 6 facts hay C(6,2)=15 pares posibles; en 60 montajes deben salir varios.
    expect(pairs.size).toBeGreaterThan(1);
  });
});
