"use client";

import { money, shortMonth } from "@/lib/format";

type Point = { month: string; revenue: number; expenses: number };

type Props = {
  data: Point[];
};

export function CashflowChart({ data }: Props) {
  const width = 560;
  const height = 220;
  const pad = { t: 18, r: 16, b: 28, l: 12 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const max = Math.max(...data.flatMap((d) => [d.revenue, d.expenses]), 1);

  const x = (i: number) => pad.l + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;

  const toPath = (key: "revenue" | "expenses") =>
    data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`)
      .join(" ");

  const area = (() => {
    if (!data.length) return "";
    const line = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.revenue).toFixed(1)}`).join(" ");
    const last = data.length - 1;
    return `${line} L ${x(last).toFixed(1)} ${y(0).toFixed(1)} L ${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`;
  })();

  const latest = data[data.length - 1];

  return (
    <div className="fs-card fs-card-pad fs-interactive">
      <div className="fs-spend-head">
        <div>
          <p className="fs-eyebrow">Cashflow</p>
          <h2 className="fs-display fs-section-title">Balance trend</h2>
        </div>
        {latest && (
          <p className="fs-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
            {shortMonth(latest.month)} · {money(latest.revenue - latest.expenses)} net
          </p>
        )}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="fs-cashflow" role="img" aria-label="Monthly revenue and expense trend">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={width - pad.r}
            y1={y(max * g)}
            y2={y(max * g)}
            stroke="rgba(46,196,160,0.1)"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="rgba(46,196,160,0.12)" />
        <path d={toPath("revenue")} fill="none" stroke="#2EC4A0" strokeWidth="2.5" className="fs-draw-path" pathLength={1} />
        <path
          d={toPath("expenses")}
          fill="none"
          stroke="#E85D4C"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="fs-draw-path"
          pathLength={1}
          style={{ animationDelay: "220ms" }}
        />
        {data.map((d, i) => (
          <text key={d.month} x={x(i)} y={height - 8} textAnchor="middle" fill="var(--muted)" fontSize="11" fontFamily="var(--font-ui)">
            {shortMonth(d.month)}
          </text>
        ))}
      </svg>

      <div className="fs-chart-legend">
        <span>
          <i style={{ background: "#2EC4A0" }} /> Revenue
        </span>
        <span>
          <i style={{ background: "#E85D4C" }} /> Expenses
        </span>
      </div>
    </div>
  );
}
