function buildCategoryBreakdown(expenses) {
  const totals = {};

  expenses.forEach((expense) => {
    if (expense.type !== 'expense') return;
    totals[expense.category] = (totals[expense.category] || 0) + Number(expense.value || 0);
  });

  const entries = Object.entries(totals)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);

  const total = entries.reduce((sum, item) => sum + item.value, 0);

  return entries.map((item) => ({
    ...item,
    percentage: total ? (item.value / total) * 100 : 0,
    label: CATEGORY_META[item.category]?.label || item.category
  }));
}
