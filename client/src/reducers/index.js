import { ACTIONS } from '../actions';

const initialState = {
  // current table name
  table_name: '',
  // cur main table rows
  table: [],
  // is loading on/of
  loading: false,
  // cur table available columns
  columns: [],
  /// for dev use localhost http://localhost:5002 for prod ''
  root_url: 'http://localhost:5002',
  // root_url: '',
  // all available tables in database
  tables: [],
  // columns selected to display
  selected_columns: [],
  // PK of current table
  primaryKey: '',
  // editmode on/of
  editing: false,
  // constrains on cur table
  constrains: {},
  // errors on curently editing cell
  errorMessages: [],
  // show alert message on/of
  alertErrorOn: false,
  // cur message in alert
  alertErrorMessage: '',
  // show or not adding new row
  newRow: false,
  // show or not errors on curently editing cell
  onCellErrorsMessage: false,
  // rows for NewTable component
  newTableRows: [],
  // current columns lengths
  lengths: new Map(),
  // all editable columns
  editable_columns: [],
  // current table models
  models: [],
  // choosen model
  model: 'All models',
  // cur versions
  versions: [],
  // choosen version
  version: 'All versions',
  // filters { table_name : [{column_name, operand, value }]
  filters: {},
  // turn filters on/of
  apply_filters: false,
  // show or not welcome message
  showWelcomeMessage: false,
  // first time show welcome message
  welcomeFirstTime: true,
  // default EditRaw
  editRaw: {},
  // validation errors in newTable
  validationErrors: 0,
  // for navigating out of components
  navigate: '/',
  // is user authorized
  isAuth: false,
};
let curTableFiters;
let newFilterState;

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case (ACTIONS.SET_TABLE):
      return { ...state, table: action.payload };
    case (ACTIONS.SET_COLUMNS):
      return { ...state, columns: action.payload[0], constrains: action.payload[1] };
    case (ACTIONS.SET_LOADING):
      return { ...state, loading: action.payload };
    case (ACTIONS.SET_TABLE_NAME):
      return {
        ...state, table_name: action.payload, model: 'All models', version: 'All versions',
      };
    case (ACTIONS.GET_TABLES):
      return { ...state, tables: action.payload };
    case (ACTIONS.SET_SELECTED):
      // eslint-disable-next-line
      localStorage.setItem(`${state.table_name}_selected`, JSON.stringify(action.payload));
      return { ...state, selected_columns: action.payload };
    case (ACTIONS.TOGGLE_SELECTED):
      // in selected columns we have values of  {name: _name, selected : true}
      const new_selected = [...state.selected_columns];
      new_selected[action.payload][1] = !state.selected_columns[action.payload][1];
      const returnValue = { ...state, selected_columns: new_selected };
      // eslint-disable-next-line
      localStorage.setItem(`${state.table_name}_selected`, JSON.stringify(new_selected));
      return returnValue;
    case (ACTIONS.SET_PK):
      return { ...state, primaryKey: action.payload };
    case (ACTIONS.EDIT_MODE):
      return { ...state, editing: action.payload };
    case (ACTIONS.SET_EDIT_ERROR_MESSAGES):
      return { ...state, errorMessages: action.payload };
    case (ACTIONS.SET_ALERT_ERROR):
      return { ...state, alertErrorOn: action.payload };
    case (ACTIONS.SET_ALERT_ERROR_MESSAGE):
      return { ...state, alertErrorMessage: action.payload };
    case (ACTIONS.OPEN_NEW_ROW):
      return { ...state, newRow: action.payload };
    case (ACTIONS.OPEN_ON_CELL_ERROR_MESSAGE):
      return { ...state, onCellErrorsMessage: action.payload };
    case (ACTIONS.SET_NEW_TABLE_ROWS):
      return { ...state, newTableRows: action.payload };
    case (ACTIONS.SET_LENGTHS):
      return { ...state, lengths: action.payload };
    case (ACTIONS.SET_EDITABLE_COLUMNS):
      return { ...state, editable_columns: action.payload };
    case (ACTIONS.SET_MODELS):
      return { ...state, models: action.payload };
    case (ACTIONS.CHOOSE_MODEL):
      return { ...state, model: action.payload };
    case (ACTIONS.SET_VERSIONS):
      return { ...state, versions: action.payload };
    case (ACTIONS.CHOOSE_VERSION):
      return { ...state, version: action.payload };
    case (ACTIONS.DEL_FILTER):
      curTableFiters = [...state.filters[action.payload.table]];
      curTableFiters.splice(action.payload.id, 1);
      newFilterState = { ...state.filters, [action.payload.table]: curTableFiters };
      // eslint-disable-next-line
      localStorage.setItem('dbm_filters', JSON.stringify(newFilterState));
      return { ...state, filters: newFilterState };
    case (ACTIONS.NEW_FILTER):
      curTableFiters = state.filters[action.payload] ? [...state.filters[action.payload]] : [];
      curTableFiters.push({ column_name: '', operand: '', value: '' });
      newFilterState = { ...state.filters, [action.payload]: curTableFiters };
      // eslint-disable-next-line
      localStorage.setItem('dbm_filters', JSON.stringify(newFilterState));
      return { ...state, filters: newFilterState };
    case (ACTIONS.MODIFY_FILTER):
      curTableFiters = [...state.filters[action.payload.table]];
      curTableFiters[action.payload.id] = action.payload.filter;
      newFilterState = { ...state.filters, [action.payload.table]: curTableFiters };
      // eslint-disable-next-line
      localStorage.setItem('dbm_filters', JSON.stringify(newFilterState));
      return { ...state, filters: newFilterState };
    case (ACTIONS.APPLY_FILTERS):
      return { ...state, apply_filters: action.payload };
    case (ACTIONS.RESTORE_FILTERS):
      return { ...state, filters: action.payload };
    case (ACTIONS.SWITCH_OFF_WELCOME):
      // eslint-disable-next-line
      localStorage.setItem('dbm_wellcome_shown', JSON.stringify(true));
      return { ...state, welcomeFirstTime: false };
    case (ACTIONS.TOGGLE_WELCOME):
      return { ...state, showWelcomeMessage: action.payload };
    case (ACTIONS.SET_EDIT_ROW):
      return { ...state, editRaw: action.payload };
    case (ACTIONS.SET_NEW_TABLE_TO_DEFAULT):
      return { ...state, newTableRows: [...state.editRaw] };
    case (ACTIONS.VALIDATION_ERRORS):
      return { ...state, validationErrors: typeof (action.payload) === 'number' ? action.payload : state.validationErrors + 1 };
    case (ACTIONS.NAVIGATE):
      return { ...state, navigate: action.payload };
    case (ACTIONS.AUTH):
      return { ...state, isAuth: action.payload };
    default:
      return { ...state };
  }
};

export default reducer;
