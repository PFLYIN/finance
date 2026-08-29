function normalizeExpense(item) {
  return {
    id: item.id || crypto.randomUUID(),
    title: item.title || 'Transação',
    value: Number(item.value || 0),
    category: item.category || 'other',
    note: item.note || '',
    type: item.type || 'expense',
    date: item.date || new Date().toISOString().slice(0, 10)
  };
}

function ensureMonthExists(state, monthKey) {
  if (!state.months[monthKey]) {
    state.months[monthKey] = { budget: 2600, expenses: [] };
  }
}

function addExpense(state, monthKey, payload) {
  ensureMonthExists(state, monthKey);
  const expense = normalizeExpense({
    ...payload,
    id: payload.id || crypto.randomUUID(),
    date: payload.date || new Date().toISOString().slice(0, 10)
  });

  state.months[monthKey].expenses.push(expense);
  state.currentMonth = monthKey;
  return expense;
}

function removeExpense(state, monthKey, expenseId) {
  ensureMonthExists(state, monthKey);
  state.months[monthKey].expenses = state.months[monthKey].expenses.filter(
    (expense) => expense.id !== expenseId
  );
}

function updateBudget(state, monthKey, value) {
  ensureMonthExists(state, monthKey);
  state.months[monthKey].budget = Math.max(0, Number(value || 0));
}

function clearMonthExpenses(state, monthKey) {
  ensureMonthExists(state, monthKey);
  state.months[monthKey].expenses = [];
}
