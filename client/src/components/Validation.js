/// --------CHECKING CONSTRAINS --------------------
import { ACTIONS } from '../actions';

export const validateCellFailed = (params, constrains, dispatch, updateState = true) => {
  // console.log('validate cell constrains =>', constrains);
  // console.log('params', params);
  if(!constrains) return
  const value = params?.props ? params.props?.value : params?.value
  const errorMessages = new Set();
  let newMessege = '';
  let notEmptyPass = true;
  let typePass = true;
  const typesToCheck = {
    integer: isInteger,
    'character varying': varCharMaxLengh,
    boolean: isBoolean,
    enum: correctEnum,
  };
  if (typesToCheck[constrains.type]) {
    [typePass, newMessege] = typesToCheck[constrains.type](value, constrains);
  }
  if (newMessege) {
    errorMessages.add(newMessege);
  }

  if (!constrains.nullable) {
    [notEmptyPass, newMessege] = notEmpty(value);
    if (newMessege) {
      errorMessages.add(newMessege);
    }
  }

  if (updateState) dispatch({ type: ACTIONS.SET_EDIT_ERROR_MESSAGES, payload: Array.from(errorMessages) });
  return !typePass || !notEmptyPass;
};

function notEmpty(value) {
  if (!value || value === '') {
    return [false, 'should not be empty'];
  }
  return [true, ''];
}

function isInteger(value) {
  if (value === '') {
    return [false, 'should be integer'];
  }
  const int = Number(value);
  if (isNaN(int)) {
    return [false, 'should be integer'];
  }
  return [true, ''];
}

function varCharMaxLengh(value, constrains) {
  const { length } = String(value);
  if (length > constrains.maxLength) {
    return [false, `should be no longer then ${constrains.maxLength} symbols`];
  }
  return [true, ''];
}

function isBoolean(value) {
  const possible = [0, 1, true, false, '0', '1', 'true', 'false'];
  if (possible.includes(value)) {
    return [true, ''];
  }
  return [false, 'should be "true", "false", "0" or "1"'];
}

function correctEnum(value, constrains) {
  const possibleValues = constrains.enumValues;
  if (possibleValues.includes(value)) {
    return [true, ''];
  }
  return [false, `should be one of the folowing: ${possibleValues.join(', ')}`];
}
