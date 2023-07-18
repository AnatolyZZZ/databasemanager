/// --------CHECKING CONSTRAINS --------------------


export const validateCellFailed = (params, constrains, dispatch) => {
    console.log('validate cell constrains =>', constrains);
    console.log('params', params);
    let errorMessage = '';
    let intPass = true, notEmptyPass=true;
    if (constrains.type === 'integer') {
        // console.log('check for int');
        // console.log(isInteger(params.props.value));
        [intPass, errorMessage] = isInteger(params.props.value);  
    }
    if (!constrains.nullable) {
        // console.log('check for empty');
        // console.log(notEmpty(params.props.value));
        [notEmptyPass, errorMessage] = notEmpty(params.props.value)
    }
    // console.log(intPass, notEmptyPass);
    // console.log('returning', !intPass || !notEmptyPass)
    dispatch({type : 'SET_ERROR_MESSAGE', payload : errorMessage})
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
    const int = Number(value);
    // console.log('int',int);
    // console.log('number', Number(value))
    if( isNaN(int)) {
        return [false, 'should be integer']
    } else {
        return [true, '']
    }
}