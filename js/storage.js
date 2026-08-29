const STORAGE_KEY = 'sin-expenses-state';

function defaultState() {
  const currentMonth = getMonthKey(new Date());
  const previousMonth = getPreviousMonthKey(currentMonth);

  return {
    currentMonth,
    months: {
      [currentMonth]: createSampleMonthData(currentMonth),
      [previousMonth]: createSampleMonthData(previousMonth)
    }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.months) return defaultState();

    const safeState = { ...defaultState(), ...parsed };
    if (!safeState.currentMonth || !safeState.months[safeState.currentMonth]) {
      safeState.currentMonth = Object.keys(safeState.months)[0];
    }

    return safeState;
  } catch (error) {
    console.warn('Erro ao carregar estado:', error);
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Erro ao salvar estado:', error);
  }
}
