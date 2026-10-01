import React from 'react';

/**
 * Parses text into distinct points based on:
 * 1. Numbered lists (e.g. "1. ... 2. ... 3. ..." or "1) ... 2) ...")
 * 2. Stage lists (e.g. "Tahap 1: ... Tahap 2: ..." or "Langkah 1: ...")
 * 3. Line breaks (\n) with or without numbering/bullets
 * 4. Lettered lists (e.g. "a. ... b. ...")
 * 5. Semicolon-delimited lists
 */
export function parseNumberedPoints(text: string | string[] | undefined | null): string[] {
  if (!text) return [];

  // If already an array of strings
  if (Array.isArray(text)) {
    return text
      .map((t) => {
        if (typeof t !== 'string') return String(t);
        return cleanLeadingMarker(t);
      })
      .filter((t) => Boolean(t && t.length > 0));
  }

  const str = String(text).trim();
  if (!str) return [];

  // 1. Check for stages: 'Tahap 1:', 'Tahap 2:', 'Langkah 1:'
  if (/(?:Tahap|Langkah)\s*\d+/i.test(str)) {
    const parts = str
      .split(/(?:[;\n]+|,\s*(?=(?:Tahap|Langkah)\s*\d+[:\.]?\s*))/i)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      return parts;
    }
  }

  // 2. Check for newline-delimited items
  if (str.includes('\n')) {
    const lines = str
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      return lines.map((l) => cleanLeadingMarker(l)).filter(Boolean);
    }
  }

  // 3. Check for in-line numbered points: e.g. "1. ... 2. ..." or "1) ... 2) ..."
  if (/(?:^|\s)\d+[\.\)]\s+/.test(str)) {
    const parts = str
      .split(/(?:^|\s+)(?=\d+[\.\)]\s+)/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      return parts.map((p) => cleanLeadingMarker(p)).filter(Boolean);
    }
  }

  // 4. Check for in-line lettered points: e.g. "a. ... b. ..." or "a) ... b) ..."
  if (/(?:^|\s)[a-e][\.\)]\s+/i.test(str)) {
    const parts = str
      .split(/(?:^|\s+)(?=[a-e][\.\)]\s+)/i)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      return parts.map((p) => cleanLeadingMarker(p)).filter(Boolean);
    }
  }

  // 5. Check for semicolon or bullet-separated lists with at least 2 distinct items
  if (str.includes(';') || str.includes(' • ') || str.includes(' - ')) {
    const parts = str
      .split(/[;•]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1 && parts.every((p) => p.length < 150)) {
      return parts.map((p) => cleanLeadingMarker(p)).filter(Boolean);
    }
  }

  return [cleanLeadingMarker(str)];
}

/**
 * Removes leading bullet markers, numbering (1., 1)), letters (a., a)), and dashes
 */
export function cleanLeadingMarker(str: string): string {
  if (!str) return '';
  return str
    .replace(/^\s*(?:[-•*]|\d+[\.\)]|[a-zA-Z][\.\)])\s*/, '')
    .trim();
}

/**
 * Checks if a string or array contains multiple points
 */
export function isMultiPoint(text: string | string[] | undefined | null): boolean {
  return parseNumberedPoints(text).length > 1;
}

export interface ReadableColumnPointsProps {
  content?: string | string[] | null;
  badgeColor?: 'amber' | 'emerald' | 'blue' | 'neutral' | 'purple';
  badgeStyle?: 'number' | 'tahap' | 'bullet' | 'auto';
  className?: string;
  itemClassName?: string;
  badgeClassName?: string;
  emptyPlaceholder?: string;
  renderAsParagraphIfSingle?: boolean;
}

/**
 * Renders list points inside table columns or document cards with:
 * - Hanging indentation (subsequent lines align with text, NOT below the number)
 * - Clear number badges (1, 2, 3...) or stage badges (Tahap 1, Tahap 2...)
 * - Comfortable vertical line spacing (space-y-1.5)
 * - 100% High-Fidelity Print-readiness (crisp borders and background in print mode)
 */
export const ReadableColumnPoints: React.FC<ReadableColumnPointsProps> = ({
  content,
  badgeColor = 'amber',
  badgeStyle = 'auto',
  className = '',
  itemClassName = '',
  badgeClassName = '',
  emptyPlaceholder = '-',
  renderAsParagraphIfSingle = true,
}) => {
  const points = parseNumberedPoints(content);

  if (points.length === 0) {
    return <span className={`text-neutral-400 italic ${className}`}>{emptyPlaceholder}</span>;
  }

  // If only 1 point and paragraph rendering is preferred
  if (points.length === 1 && renderAsParagraphIfSingle) {
    return <div className={`leading-snug text-neutral-800 ${className}`}>{points[0]}</div>;
  }

  // Determine badge color styling
  const colorStyles: Record<string, string> = {
    amber: 'bg-amber-100/90 text-amber-950 border-amber-300 print:border-black print:bg-neutral-100 print:text-black',
    emerald: 'bg-emerald-100/90 text-emerald-950 border-emerald-400 print:border-black print:bg-neutral-100 print:text-black',
    blue: 'bg-blue-100/90 text-blue-950 border-blue-300 print:border-black print:bg-neutral-100 print:text-black',
    purple: 'bg-purple-100/90 text-purple-950 border-purple-300 print:border-black print:bg-neutral-100 print:text-black',
    neutral: 'bg-neutral-100 text-neutral-900 border-neutral-300 print:border-black print:bg-neutral-100 print:text-black',
  };

  const selectedColorStyle = colorStyles[badgeColor] || colorStyles.amber;

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {points.map((pt, idx) => {
        // Detect if this item is a "Tahap" or "Langkah"
        const isTahapItem = /^(Tahap|Langkah)\s*(\d+)[:\.]?\s*/i.test(pt);
        const forceTahap = badgeStyle === 'tahap' || (badgeStyle === 'auto' && isTahapItem);

        if (forceTahap) {
          const match = pt.match(/^(Tahap|Langkah)\s*(\d+)[:\.]?\s*(.*)$/i);
          const stageType = match ? match[1] : 'Tahap';
          const stageNumber = match ? match[2] : String(idx + 1);
          const textContent = match && match[3] ? match[3] : cleanLeadingMarker(pt);

          return (
            <div key={idx} className={`flex items-start gap-1.5 leading-snug ${itemClassName}`}>
              <span
                className={`inline-flex items-center justify-center font-mono font-black text-[9px] px-1.5 py-0.5 rounded border shrink-0 mt-[1px] select-none uppercase tracking-tight ${selectedColorStyle} ${badgeClassName}`}
              >
                {stageType} {stageNumber}
              </span>
              <span className="flex-1 min-w-0 text-neutral-800 break-words">{textContent}</span>
            </div>
          );
        }

        if (badgeStyle === 'bullet') {
          return (
            <div key={idx} className={`flex items-start gap-2 leading-snug ${itemClassName}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-800 shrink-0 mt-1.5 select-none print:bg-black" />
              <span className="flex-1 min-w-0 text-neutral-800 break-words">{pt}</span>
            </div>
          );
        }

        // Default: Numbered badge with hanging indent
        return (
          <div key={idx} className={`flex items-start gap-1.5 leading-snug ${itemClassName}`}>
            <span
              className={`inline-flex items-center justify-center font-mono font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded border shrink-0 mt-[1px] select-none text-center ${selectedColorStyle} ${badgeClassName}`}
            >
              {idx + 1}
            </span>
            <span className="flex-1 min-w-0 text-neutral-900 break-words">{pt}</span>
          </div>
        );
      })}
    </div>
  );
};
export default ReadableColumnPoints;
