export const validateCellFailed = (value) => {
    // console.log('params.value =>', value)
    if (!value || value === "") {
        console.log('true')
      return true;
    } else {
        return false;
    }
}