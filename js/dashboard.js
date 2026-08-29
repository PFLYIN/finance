function getMonthSummary(expenses, budget = 0) {
  const totalExpenses = expenses
    .filter((expense) => expense.type === 'expense')
    .reduce((sum, expense) => sum + Number(expense.value || 0), 0);

  const totalIncome = expenses
    .filter((expense) => expense.type === 'income')
    .reduce((sum, expense) => sum + Number(expense.value || 0), 0);

  const largestExpense = expenses
    .filter((expense) => expense.type === 'expense')
    .sort((a, b) => Number(b.value) - Number(a.value))[0] || null;

  const average = expenses.filter((expense) => expense.type === 'expense').length
    ? totalExpenses / expenses.filter((expense) => expense.type === 'expense').length
    : 0;

  return {
    totalExpenses,
    totalIncome,
    largestExpense,
    average,
    remaining: Math.max(0, budget - totalExpenses),
    transactionCount: expenses.length,
    budget,
    delta: totalIncome - totalExpenses
  };
}

function getComparisonSummary(state, monthKey) {
  const previousMonth = getPreviousMonthKey(monthKey);
  const currentMonthData = state.months[monthKey] || { expenses: [], budget: 0 };
  const previousMonthData = state.months[previousMonth] || { expenses: [], budget: 0 };

  const currentSummary = getMonthSummary(currentMonthData.expenses, currentMonthData.budget);
  const previousSummary = getMonthSummary(previousMonthData.expenses, previousMonthData.budget);

  const trend = previousSummary.totalExpenses
    ? ((currentSummary.totalExpenses - previousSummary.totalExpenses) / previousSummary.totalExpenses) * 100
    : 0;

  return {
    current: currentSummary,
    previous: previousSummary,
    trend
  };
}
