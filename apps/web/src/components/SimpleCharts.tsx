"use client";

type Point = { label: string; a: number; b: number };

export function DualLineChart({ data }: { data: Point[] }) {
  const width = 560;
  const height = 220;
  const pad = 28;
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b]));
  const x = (i: number) => pad + (i * (width - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => height - pad - (v / max) * (height - pad * 2);
  const path = (key: "a" | "b") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d[key])}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="fs-cashflow"
      role="img"
      aria-label="Revenue vs expenses"
    >
      <path className="fs-draw-path" d={path("a")} fill="none" stroke="var(--mint)" strokeWidth="2.5" pathLength={1} />
      <path className="fs-draw-path" d={path("b")} fill="none" stroke="var(--loss)" strokeWidth="2.5" pathLength={1} />
      {data.map((d, i) => (
        <text
          key={d.label}
          x={x(i)}
          y={height - 8}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="10"
          fontFamily="var(--font-ui)"
        >
          {d.label.slice(5)}
        </text>
      ))}
    </svg>
  );
}

export function DualBarChart({ data }: { data: Point[] }) {
  const width = 560;
  const height = 220;
  const pad = 28;
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b]));
  const groupW = (width - pad * 2) / Math.max(1, data.length);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="fs-cashflow"
      role="img"
      aria-label="Budget vs actual"
    >
      {data.map((d, i) => {
        const baseX = pad + i * groupW;
        const hA = (d.a / max) * (height - pad * 2);
        const hB = (d.b / max) * (height - pad * 2);
        return (
          <g key={d.label}>
            <rect
              className="fs-bar-grow"
              x={baseX + 8}
              y={height - pad - hA}
              width={groupW * 0.3}
              height={hA}
              fill="var(--mint-dim)"
              rx="3"
              style={{ animationDelay: `${i * 60}ms` }}
            />
            <rect
              className="fs-bar-grow"
              x={baseX + groupW * 0.4}
              y={height - pad - hB}
              width={groupW * 0.3}
              height={hB}
              fill="var(--warn)"
              rx="3"
              style={{ animationDelay: `${i * 60 + 40}ms` }}
            />
            <text
              x={baseX + groupW / 2}
              y={height - 8}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="10"
              fontFamily="var(--font-ui)"
            >
              {d.label.slice(0, 8)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
