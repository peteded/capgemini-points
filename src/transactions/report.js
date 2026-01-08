function monthKey(isoDate) {
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // e.g. "2026-01"
}

function lastNMonthKeys(n) {
  const keys = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    keys.push(`${y}-${m}`);
  }
  return keys;
}

export function buildThreeMonthCustomerReport(transactions) {
  const months = lastNMonthKeys(3);
  const monthSet = new Set(months);

  const report = {}; // customerId -> { months: {...}, totalPoints, totalSpent }

  for (const tx of transactions) {
    const mk = monthKey(tx.createdAt);
    if (!monthSet.has(mk)) continue;

    const cid = tx.customerId || "anonymous";
    report[cid] ??= { months: {}, totalPoints: 0, totalSpent: 0 };

    report[cid].months[mk] ??= { points: 0, total: 0, transactions: [] };

    report[cid].months[mk].points += tx.points || 0;
    report[cid].months[mk].total += tx.total || 0;
    report[cid].months[mk].transactions.push(tx);

    report[cid].totalPoints += tx.points || 0;
    report[cid].totalSpent += tx.total || 0;
  }

  return { months, report };
}
