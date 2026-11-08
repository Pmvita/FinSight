export function money(n: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(n);
}

export function shortMonth(isoMonth: string) {
  const [y, m] = isoMonth.split("-").map(Number);
  return new Date(y, (m || 1) - 1, 1).toLocaleString("en-US", { month: "short" });
}
