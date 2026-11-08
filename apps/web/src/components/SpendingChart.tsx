"use client";

import { money } from "@/lib/format";

type Slice = { category: string; amount: number; type: "income" | "expense" };

const PALETTE = ["#2EC4A0", "#1A8F74", "#E8A317", "#6FB89A", "#E85D4C", "#4A7F6E"];

type Props = {
  data: Slice[];
};

export function SpendingChart({ data }: Props) {
  const expenses = data.filter((d) => d.type === "expense").slice(0, 6);
  const total = expenses.reduce((sum, d) => sum + d.amount, 0) || 1;
  const max = Math.max(...expenses.map((d) => d.amount), 1);

  let offset = 0;
  const arcs = expenses.map((slice, i) => {
    const fraction = slice.amount / total;
    const start = offset;
    offset += fraction;
    return { ...slice, fraction, start, color: PALETTE[i % PALETTE.length] };
  });

  return (
    <div className="fs-card fs-card-pad fs-interactive fs-spend-card">
      <div className="fs-spend-head">
        <div>
          <p className="fs-eyebrow">Breakdown</p>
          <h2 className="fs-display fs-section-title">Spending mix</h2>
        </div>
        <p className="fs-muted fs-spend-total">{money(total)} total</p>
      </div>

      <div className="fs-spend-grid">
        <svg viewBox="0 0 160 160" role="img" aria-label="Expense category donut chart" className="fs-donut">
          <g transform="translate(80 80)">
            <circle r={52} fill="none" stroke="rgba(46,196,160,0.12)" strokeWidth="18" />
            {arcs.map((arc, i) => (
              <circle
                key={arc.category}
                r={52}
                fill="none"
                stroke={arc.color}
                strokeWidth="18"
                pathLength={1}
                strokeDasharray={`${arc.fraction} ${1 - arc.fraction}`}
                strokeDashoffset={-arc.start}
                className="fs-draw-path"
                style={{ animationDelay: `${140 + i * 70}ms` }}
                transform="rotate(-90)"
              />
            ))}
            <text textAnchor="middle" dominantBaseline="central" fill="var(--ink)" fontSize="15" fontFamily="var(--font-ui)">
              {expenses.length}
            </text>
            <text y="16" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="var(--font-ui)">
              categories
            </text>
          </g>
        </svg>

        <ul className="fs-legend">
          {arcs.map((slice, i) => (
            <li key={slice.category}>
              <div className="fs-legend-row">
                <span>
                  <i aria-hidden style={{ background: slice.color }} />
                  {slice.category}
                </span>
                <strong>{money(slice.amount)}</strong>
              </div>
              <div className="fs-meter">
                <div
                  className="fs-bar-grow"
                  style={{
                    width: `${(slice.amount / max) * 100}%`,
                    background: slice.color,
                    animationDelay: `${100 + i * 60}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
