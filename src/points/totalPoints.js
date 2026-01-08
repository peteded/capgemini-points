export function inLast90Days(isoDate) {
  const t = new Date(isoDate).getTime();
  const now = Date.now();
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  return now - t <= ninetyDays;
}

export function monthKeyFromISO(isoDate) {
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // e.g. "2026-01"
}

export function totalPoints3months(transactions, customerId) {
  const months = {}; // { "YYYY-MM": points }
  let totalPoints = 0;

  const filtered = transactions.filter(
    (t) => t.customerId === customerId && inLast90Days(t.createdAt)
  );

  for (const t of filtered) {
    const key = monthKeyFromISO(t.createdAt);
    months[key] = (months[key] || 0) + (t.points || 0);
    totalPoints += t.points || 0;
  }

  const monthKeys = Object.keys(months).sort();

  return { filtered, months, monthKeys, totalPoints };
}
