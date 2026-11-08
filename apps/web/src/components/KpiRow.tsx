"use client";

import { CountUp } from "@/components/CountUp";

type Props = {
  revenue: number;
  expenses: number;
  net: number;
};

export function KpiRow({ revenue, expenses, net }: Props) {
  const items = [
    { label: "Revenue", value: revenue, tone: "up" as const },
    { label: "Expenses", value: expenses, tone: "down" as const },
    { label: "Net margin", value: net, tone: net >= 0 ? ("up" as const) : ("down" as const) },
  ];

  return (
    <section className="fs-kpi-row" aria-label="Overview KPIs">
      {items.map((item, i) => (
        <article key={item.label} className={`fs-card fs-card-pad fs-interactive fs-rise fs-rise-d${i + 1}`}>
          <p className="fs-kpi-label">{item.label}</p>
          <p className={`fs-kpi-value fs-${item.tone}`}>
            <CountUp value={item.value} />
          </p>
        </article>
      ))}
    </section>
  );
}
