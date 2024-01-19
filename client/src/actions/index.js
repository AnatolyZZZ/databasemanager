export const ACTIONS = {
  SET_TABLE: 'SET_TABLE',
  SET_COLUMNS: 'SET_COLUMNS',
  SET_LOADING: 'SET_LOADING',
  SET_TABLE_NAME: 'SET_TABLE_NAME',
  GET_TABLES: 'GET_TABLES',
  TOGGLE_SELECTED: 'TOGGLE_SELECTED',
  SET_SELECTED: 'SET_SELECTED',
  SET_PK: 'SET_PK',
  EDIT_MODE: 'EDIT_MODE',
  SET_EDIT_ERROR_MESSAGES: 'SET_ERROR_MESSAGE',
  SET_ALERT_ERROR: 'SET_ALERT_ERROR',
  SET_ALERT_ERROR_MESSAGE: 'SET_ALERT_ERROR_MESSAGE',
  OPEN_NEW_ROW: 'OPEN_NEW_ROW',
  OPEN_ON_CELL_ERROR_MESSAGE: 'OPEN_ON_CELL_ERROR_MESSAGE',
  SET_NEW_TABLE_ROWS: 'SET_NEW_TABLE_ROWS',
  SET_LENGTHS: 'SET_LENGTHS',
  SET_EDITABLE_COLUMNS: 'SET_EDITABLE_COLUMNS',
  SET_MODELS: 'SET_MODELS',
  CHOOSE_MODEL: 'CHOOSE_MODEL',
  SET_VERSIONS: 'SET_VERSIONS',
  CHOOSE_VERSION: 'CHOOSE_VERSION',
  DEL_FILTER: 'DEL_FILTER',
  NEW_FILTER: 'NEW_FILTER',
  MODIFY_FILTER: 'MODIFY_FILTER',
  APPLY_FILTERS: 'APPLY_FILTERS',
  RESTORE_FILTERS: 'RESTORE_FILTERS',
  TOGGLE_WELCOME: 'TOGGLE_WELCOME',
  SWITCH_OFF_WELCOME: 'SWITCH_OFF_WELCOME',
  SET_EDIT_ROW: 'SET_EDIT_ROW',
  SET_NEW_TABLE_TO_DEFAULT: 'SET_NEW_TABLE_TO_DEFAULT',
  VALIDATION_ERRORS: 'VALIDATION_ERRORS',
  NAVIGATE: 'NAVIGATE',
  AUTH: 'AUTH'
};

export const setTable = (table) => ({
  type: ACTIONS.SET_TABLE,
  payload: table,
});

export const setTableName = (name) => ({
  type: ACTIONS.SET_TABLE_NAME,
  payload: name,
});

export const setColumns = (columnNames) => ({
  type: ACTIONS.SET_COLUMNS,
  payload: columnNames,
});

export const setTableNames = (tableNames) => ({
  type: ACTIONS.GET_TABLES,
  payload: tableNames,
});

export const toggleSelected = (id) => ({
  type: ACTIONS.TOGGLE_SELECTED,
  payload: id,
});

export const setSelected = (newSelected) => ({
  type: ACTIONS.SET_SELECTED,
  payload: newSelected,
});

export const setPrimaryKey = (key) => ({
  type: ACTIONS.SET_PK,
  payload: key,
});

export const setEditMode = (val) => ({
  type: ACTIONS.EDIT_MODE,
  payload: val,
});

export const setAlertError = (val) => ({
  type: ACTIONS.SET_ALERT_ERROR,
  payload: val,
});

export const setAlertErrorMessage = (val) => ({
  type: ACTIONS.SET_ALERT_ERROR_MESSAGE,
  payload: val,
});

export const openNewRow = (val) => ({
  type: ACTIONS.OPEN_NEW_ROW,
  payload: val,
});

export const openOnCellErrorMessage = (val) => ({
  type: ACTIONS.OPEN_ON_CELL_ERROR_MESSAGE,
  payload: val,
});

export const setNewTableRows = (val) => ({
  type: ACTIONS.SET_NEW_TABLE_ROWS,
  payload: val,
});

export const setLengths = (val) => ({
  type: ACTIONS.SET_LENGTHS,
  payload: val,
});
export const setEditableColumns = (val) => ({
  type: ACTIONS.SET_EDITABLE_COLUMNS,
  payload: val,
});

export const setModels = (val) => ({
  type: ACTIONS.SET_MODELS,
  payload: val,
});

export const setVersions = (val) => ({
  type: ACTIONS.SET_VERSIONS,
  payload: val,
});

export const chooseModel = (val) => ({
  type: ACTIONS.CHOOSE_MODEL,
  payload: val,
});
export const chooseVersion = (val) => ({
  type: ACTIONS.CHOOSE_VERSION,
  payload: val,
});

export const delFilter = (table_name, id) => ({
  type: ACTIONS.DEL_FILTER,
  payload: { table: table_name, id },
});

export const modifyFilter = (table_name, id, new_filter) => ({
  type: ACTIONS.MODIFY_FILTER,
  payload: { table: table_name, id, filter: new_filter },
});

export const newFilter = (table_name) => ({
  type: ACTIONS.NEW_FILTER,
  payload: table_name,
});

export const applyFilters = (val) => ({
  type: ACTIONS.APPLY_FILTERS,
  payload: val,
});

export const restoreFilters = (val) => ({
  type: ACTIONS.RESTORE_FILTERS,
  payload: val,
});

export const switchOffWelcomeWord = () => ({
  type: ACTIONS.SWITCH_OFF_WELCOME,
});

export const toggleWelcome = (val) => ({
  type: ACTIONS.TOGGLE_WELCOME,
  payload: val,
});

export const setEditRow = (val) => ({
  type: ACTIONS.SET_EDIT_ROW,
  payload: val
})

export const validationErrors = (val) => ({
  type: ACTIONS.VALIDATION_ERRORS,
  payload: val
})

export const setNewTableToDefault = () => ({ type: ACTIONS.SET_NEW_TABLE_TO_DEFAULT })

export const myNavigate = (route) => ({
  type: ACTIONS.NAVIGATE,
  payload: route
})

export const setAuth = (val) => ({
  type: ACTIONS.AUTH,
  payload: val
})