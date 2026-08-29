const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const CATEGORY_META = {
  food: { label: 'Alimentação', icon: '🍔', color: '#d4c36a' },
  transport: { label: 'Transporte', icon: '🚗', color: '#a99a3e' },
  leisure: { label: 'Lazer', icon: '🎮', color: '#c93c52' },
  studies: { label: 'Estudos', icon: '📚', color: '#e8e3d5' },
  bills: { label: 'Contas', icon: '💳', color: '#f1d27a' },
  shopping: { label: 'Compras', icon: '🛒', color: '#8adbb4' },
  other: { label: 'Outros', icon: '💰', color: '#a39db4' }
};

function getMonthKey(date = new Date()) {
  const dt = new Date(date);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthKey(key) {
  const [year, month] = key.split('-').map(Number);
  if (!year || !month) return 'Mês';
  return `${MONTH_LABELS[month - 1]} ${year}`;
}

function getPreviousMonthKey(key) {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);
  return getMonthKey(date);
}

function getNextMonthKey(key) {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + 1);
  return getMonthKey(date);
}

function createSeedExpense(title, value, category, date, note = '', type = 'expense') {
  return {
    id: `seed-${crypto.randomUUID()}`,
    title,
    value: Number(value),
    category,
    date,
    note,
    type
  };
}

function createSampleMonthData(monthKey) {
  const current = monthKey === getMonthKey();
  const expenseBase = [
    ['Mercado', 184.5, 'food', '2026-08-04', 'Semana'],
    ['Uber', 68.2, 'transport', '2026-08-08', 'Trabalho'],
    ['Streaming', 39.9, 'leisure', '2026-08-10', 'Vibes'],
    ['Faculdade', 240, 'studies', '2026-08-12', 'Mensalidade'],
    ['Internet', 95, 'bills', '2026-08-13', 'Condomínio'],
    ['Loja', 132.8, 'shopping', '2026-08-14', 'Essenciais']
  ];

  const currentMonthExpenses = current ? expenseBase.map(([title, value, category, date, note]) => createSeedExpense(title, value, category, date, note, 'expense')) : [
    createSeedExpense('Mercado', 162.3, 'food', `${monthKey}-04`, 'Comida', 'expense'),
    createSeedExpense('Gasolina', 90, 'transport', `${monthKey}-07`, 'Viagem', 'expense'),
    createSeedExpense('Curso', 220, 'studies', `${monthKey}-12`, 'Módulo', 'expense'),
    createSeedExpense('Renda extra', 520, 'other', `${monthKey}-15`, 'Freela', 'income')
  ];

  return {
    budget: current ? 2600 : 2200,
    expenses: currentMonthExpenses
  };
}
