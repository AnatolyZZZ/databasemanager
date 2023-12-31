/// --------CHECKING CONSTRAINS --------------------
import { ACTIONS } from "../actions";


export const validateCellFailed = (params, constrains, dispatch) => {
    // console.log('validate cell constrains =>', constrains);
    // console.log('params', params);
    let errorMessages = new Set();
    let newMessege = '';
    let notEmptyPass = true;
    let typePass = true;
    const typesToCheck = {
        'integer' : isInteger,
        'character varying' : varCharMaxLengh,
        'boolean' : isBoolean,
        'enum' : correctEnum
    }
    if (typesToCheck[constrains.type]) {
        [typePass, newMessege] = typesToCheck[constrains.type](params.props.value, constrains);
    }
    if (newMessege) {
            errorMessages.add(newMessege)
        }
    
    if (!constrains.nullable) {
        [notEmptyPass, newMessege] = notEmpty(params.props.value);
        if (newMessege) {
            errorMessages.add(newMessege)
        } 
    }

    dispatch({type : ACTIONS.SET_EDIT_ERROR_MESSAGES, payload : Array.from(errorMessages)})
    return !typePass || !notEmptyPass
}

function notEmpty (value) {
    if (!value || value === "") {
      return [false, 'should not be empty'];
    } else {
        return [true, ''];
    }
}

function isInteger  (value) {
    if (value === '') {
        return [false, 'should be integer']
    }
    const int = Number(value);
    if( isNaN(int)) {
        return [false, 'should be integer']
    } else {
        return [true, '']
    }
}

function varCharMaxLengh (value, constrains) {
    const length = String(value).length;
    if (length > constrains.maxLength) {
        return [false, `should be no longer then ${constrains.maxLength} symbols`]
    } else {
        return [true, '']
    }
}

function isBoolean (value) {
    const possible = [0, 1, true, false, '0', '1', 'true', 'false']
    if (possible.includes(value)) {
        return [true , ''];
    } else {
        return [false, 'should be "true", "false", "0" or "1"']
    }
}

function correctEnum (value, constrains) { 
    const possibleValues = constrains.enumValues
    if (possibleValues.includes(value)) {
        return [true, '']
    } else {
        return [false, `should be one of the folowing: ${possibleValues.join(', ')}`]
    }
}
    


