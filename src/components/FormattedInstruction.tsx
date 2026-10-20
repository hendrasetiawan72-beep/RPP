import React from 'react';
import { parseInstruksi } from '../utils/formatInstruksi';

interface FormattedInstructionProps {
  text?: string | null;
  className?: string;
}

/**
 * Menampilkan teks instruksi panjang sebagai paragraf + daftar bernomor dengan indentasi menggantung
 * (baris kedua sejajar dengan teks, bukan dengan angka) dan sub-butir bertitik.
 */
export const FormattedInstruction: React.FC<FormattedInstructionProps> = ({ text, className = '' }) => {
  const blok = parseInstruksi(text);
  if (blok.length === 0) return null;

  return (
    <div className={`space-y-1.5 text-neutral-900 leading-relaxed ${className}`}>
      {blok.map((b, i) => {
        if (b.type === 'p') return <p key={i}>{b.text}</p>;
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc list-outside pl-6 space-y-0.5">
              {b.items.map((it, j) => (
                <li key={j} className="pl-1">
                  {it}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={i} className="list-decimal list-outside pl-6 space-y-1.5">
            {b.items.map((it, j) => (
              <li key={j} className="pl-1">
                {it.text}
                {it.subs.length > 0 && (
                  <ul className="list-disc list-outside pl-5 mt-1 space-y-0.5">
                    {it.subs.map((s, k) => (
                      <li key={k} className="pl-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
};
