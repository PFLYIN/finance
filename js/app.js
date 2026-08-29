document.addEventListener('DOMContentLoaded', () => {
  const state = loadState();
  const form = document.getElementById('expenseForm');
  const currentMonthLabel = document.getElementById('currentMonthLabel');
  const budgetInput = document.getElementById('budgetInput');
  const newMonthBtn = document.getElementById('newMonthBtn');
  const clearMonthBtn = document.getElementById('clearMonthBtn');

  function render() {
    const monthData = state.months[state.currentMonth] || { expenses: [], budget: 0 };
    const summary = getMonthSummary(monthData.expenses, monthData.budget);

    renderMonthTabs(state);
    renderSummaryCards(summary);
    renderTransactions(monthData.expenses);
    renderCategoryChart(monthData.expenses);
    renderBudget(monthData);
    renderComparison(state, state.currentMonth);
    currentMonthLabel.textContent = formatMonthKey(state.currentMonth);
  }

  function switchMonth(monthKey) {
    ensureMonthExists(state, monthKey);
    state.currentMonth = monthKey;
    saveState(state);
    render();
  }

  document.getElementById('monthsList').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-month-key]');
    if (!btn) return;
    switchMonth(btn.dataset.monthKey);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const expenseName = document.getElementById('expenseName').value.trim();
    const expenseValue = Number(document.getElementById('expenseValue').value);
    const expenseCategory = document.getElementById('expenseCategory').value;
    const expenseType = document.getElementById('expenseType').value;
    const expenseDate = document.getElementById('expenseDate').value || new Date().toISOString().slice(0, 10);
    const expenseNote = document.getElementById('expenseNote').value.trim();

    if (!expenseName || !expenseValue) {
      showToast('Preencha nome e valor.', 'error');
      return;
    }

    addExpense(state, state.currentMonth, {
      title: expenseName,
      value: expenseValue,
      category: expenseCategory,
      type: expenseType,
      date: expenseDate,
      note: expenseNote
    });

    saveState(state);
    form.reset();
    document.getElementById('expenseDate').value = new Date().toISOString().slice(0, 10);
    render();
    showToast('Transação registrada com sucesso.');
  });

  document.getElementById('saveBudgetBtn').addEventListener('click', () => {
    const value = Number(budgetInput.value || 0);
    if (!value && value !== 0) {
      showToast('Defina um orçamento válido.', 'error');
      return;
    }

    updateBudget(state, state.currentMonth, value);
    saveState(state);
    render();
    showToast('Orçamento atualizado.');
  });

  newMonthBtn.addEventListener('click', () => {
    const monthKey = getMonthKey(new Date());
    if (!state.months[monthKey]) {
      state.months[monthKey] = { budget: 2600, expenses: [] };
    }
    state.currentMonth = monthKey;
    saveState(state);
    render();
    showToast('Novo mês criado.');
  });

  clearMonthBtn.addEventListener('click', () => {
    if (!window.confirm('Deseja limpar todas as transações deste mês?')) return;
    clearMonthExpenses(state, state.currentMonth);
    saveState(state);
    render();
    showToast('Mês limpo.');
  });

  document.getElementById('transactionsList').addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-delete-id]');
    if (deleteBtn) {
      removeExpense(state, state.currentMonth, deleteBtn.dataset.deleteId);
      saveState(state);
      render();
      showToast('Transação removida.');
      return;
    }

    const editBtn = event.target.closest('[data-edit-id]');
    if (editBtn) {
      const expense = (state.months[state.currentMonth]?.expenses || []).find((item) => item.id === editBtn.dataset.editId);
      if (!expense) return;

      document.getElementById('expenseName').value = expense.title;
      document.getElementById('expenseValue').value = expense.value;
      document.getElementById('expenseCategory').value = expense.category;
      document.getElementById('expenseType').value = expense.type;
      document.getElementById('expenseDate').value = expense.date;
      document.getElementById('expenseNote').value = expense.note || '';

      removeExpense(state, state.currentMonth, expense.id);
      saveState(state);
      render();
      showToast('Transação carregada para edição.');
    }
  });

  document.getElementById('resetFormBtn').addEventListener('click', () => {
    document.getElementById('expenseDate').value = new Date().toISOString().slice(0, 10);
  });

  document.getElementById('expenseDate').value = new Date().toISOString().slice(0, 10);
  render();
});
