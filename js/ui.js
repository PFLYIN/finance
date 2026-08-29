function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSummaryCards(summary) {
  const container = document.getElementById('summaryCards');
  if (!container) return;

  const cards = [
    { label: 'Total gasto', value: formatCurrency(summary.totalExpenses), tone: 'negative' },
    { label: 'Quantidade', value: `${summary.transactionCount}`, tone: 'neutral' },
    { label: 'Maior gasto', value: summary.largestExpense ? formatCurrency(summary.largestExpense.value) : 'R$ 0,00', tone: 'warning' },
    { label: 'Média', value: formatCurrency(summary.average), tone: 'neutral' },
    { label: 'Disponível', value: formatCurrency(summary.remaining), tone: 'positive' }
  ];

  container.innerHTML = cards.map((card) => `
    <article class="summary-card ${card.tone}">
      <span class="label">${card.label}</span>
      <span class="value">${card.value}</span>
    </article>
  `).join('');
}

function renderMonthTabs(state) {
  const container = document.getElementById('monthsList');
  if (!container) return;

  const keys = Object.keys(state.months).sort((a, b) => a.localeCompare(b));
  container.innerHTML = keys.map((monthKey) => `
    <button type="button" class="month-tab ${monthKey === state.currentMonth ? 'active' : ''}" data-month-key="${monthKey}">
      ${formatMonthKey(monthKey)}
    </button>
  `).join('');
}

function renderTransactions(expenses) {
  const list = document.getElementById('transactionsList');
  if (!list) return;

  if (!expenses.length) {
    list.innerHTML = '<li class="transaction-item"><div class="transaction-info"><span class="transaction-name">Nenhuma transação registrada.</span></div></li>';
    return;
  }

  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  list.innerHTML = sorted.map((expense) => {
    const meta = CATEGORY_META[expense.category] || CATEGORY_META.other;
    const signed = expense.type === 'income' ? '+' : '-';
    return `
      <li class="transaction-item" data-id="${expense.id}">
        <div class="transaction-info">
          <span class="transaction-name">${escapeHtml(expense.title)}</span>
          <span class="transaction-meta">${meta.icon} ${meta.label} • ${escapeHtml(expense.date || '')} ${expense.note ? `• ${escapeHtml(expense.note)}` : ''}</span>
        </div>
        <div class="transaction-side">
          <span class="amount ${expense.type === 'income' ? 'income' : 'expense'}">${signed}${formatCurrency(expense.value)}</span>
          <span class="category-badge">${meta.label}</span>
          <div class="transaction-actions">
            <button type="button" class="icon-btn edit-btn" data-edit-id="${expense.id}" aria-label="Editar">✎</button>
            <button type="button" class="icon-btn delete-btn" data-delete-id="${expense.id}" aria-label="Excluir">✕</button>
          </div>
        </div>
      </li>
    `;
  }).join('');
}

function renderCategoryChart(expenses) {
  const chart = document.getElementById('categoryChart');
  if (!chart) return;

  const breakdown = buildCategoryBreakdown(expenses);
  if (!breakdown.length) {
    chart.innerHTML = '<div class="transaction-item"><div class="transaction-info"><span class="transaction-name">Sem dados suficientes.</span></div></div>';
    return;
  }

  const max = Math.max(...breakdown.map((item) => item.value), 1);

  chart.innerHTML = breakdown.map((item) => `
    <div class="chart-row">
      <div class="chart-row-head">
        <span>${item.label}</span>
        <span>${item.percentage.toFixed(0)}%</span>
      </div>
      <div class="chart-bar"><span style="width:${(item.value / max) * 100}%"></span></div>
    </div>
  `).join('');
}

function renderBudget(monthData) {
  const budgetValue = document.getElementById('budgetValue');
  const budgetProgress = document.getElementById('budgetProgress');
  const budgetRemaining = document.getElementById('budgetRemaining');
  const budgetUsage = document.getElementById('budgetUsage');
  const budgetInput = document.getElementById('budgetInput');

  if (!monthData) return;

  const used = getMonthSummary(monthData.expenses, monthData.budget).totalExpenses;
  const percentage = monthData.budget ? (used / monthData.budget) * 100 : 0;
  const remaining = monthData.budget - used;

  budgetValue.textContent = formatCurrency(monthData.budget);
  budgetInput.value = monthData.budget;
  budgetProgress.style.width = `${Math.min(percentage, 100)}%`;
  budgetRemaining.textContent = `Restante: ${formatCurrency(remaining)}`;
  budgetUsage.textContent = `${Math.min(percentage, 100).toFixed(0)}% usado`;
}

function renderComparison(state, monthKey) {
  const comparison = document.getElementById('monthComparison');
  if (!comparison) return;

  const comp = getComparisonSummary(state, monthKey);
  const currentLabel = formatMonthKey(monthKey);
  const previousLabel = formatMonthKey(getPreviousMonthKey(monthKey));
  const trend = comp.trend > 0 ? 'acima' : comp.trend < 0 ? 'abaixo' : 'em linha';

  comparison.innerHTML = `
    <div class="comparison-row">
      <span>${currentLabel}</span>
      <strong>${formatCurrency(comp.current.totalExpenses)}</strong>
    </div>
    <div class="comparison-row">
      <span>${previousLabel}</span>
      <strong>${formatCurrency(comp.previous.totalExpenses)}</strong>
    </div>
    <div class="comparison-row">
      <span>Variação</span>
      <strong>${Math.abs(comp.trend).toFixed(0)}% ${trend}</strong>
    </div>
  `;
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2200);
}
