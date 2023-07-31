/// --------CHECKING CONSTRAINS --------------------
import { ACTIONS } from "../actions";


export const validateCellFailed = (params, constrains, dispatch) => {
    console.log('validate cell constrains =>', constrains);
    console.log('params', params);
    let errorMessages = new Set();
    let newMessege = '';
    let intPass = true, notEmptyPass=true;
    if (constrains.type === 'integer') {
        // console.log('check for int');
        // console.log(isInteger(params.props.value));
        [intPass, newMessege] = isInteger(params.props.value);
        if (newMessege) {
            errorMessages.add(newMessege)
        }  
    }
    if (!constrains.nullable) {
        // console.log('check for empty');
        // console.log(notEmpty(params.props.value));
        [notEmptyPass, newMessege] = notEmpty(params.props.value);
        if (newMessege) {
            errorMessages.add(newMessege)
        } 
    }
    // console.log(intPass, notEmptyPass);
    // console.log('returning', !intPass || !notEmptyPass)
    // console.log('errors in validation', Array.from(errorMessages))
    dispatch({type : ACTIONS.SET_EDIT_ERROR_MESSAGES, payload : Array.from(errorMessages)})
    return !intPass || !notEmptyPass
}
const notEmpty = (value) => {
    if (!value || value === "") {
      return [false, 'should not be empty'];
    } else {
        return [true, ''];
    }
}

const isInteger = (value) => {
    if (value === '') {
        return [false, 'should be integer']
    }
    const int = Number(value);
    // console.log('int',int);
    // console.log('number', Number(value))
    if( isNaN(int)) {
        return [false, 'should be integer']
    } else {
        return [true, '']
    }
}