export function calculateBuyerPoints(total) {
  const dollars = Math.floor(Number(total) || 0);

  const over100 = Math.max(dollars - 100, 0);
  const between50And100 = Math.max(Math.min(dollars, 100) - 50, 0);

  return over100 * 2 + between50And100;
}
