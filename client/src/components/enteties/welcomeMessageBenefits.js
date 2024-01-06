export const benefits = {
  copy_model:
    `<p>If a table has column named "model" you can copy all records with the same value in model column to a new model</p>
    <p> or to the same model but with different version</p>
    <p>To check this functionality select table "with_model"</p>
    <p> and press button "NEW VERSION" </p>`,
  copy_version:
        `<p>If a given Model has different versions,</p>
        <p> you can copy just a desired version to a new version in the same or in another model</p>
        <p> On the final step you can eddit part of table you copy (otherwise what's the reason to create new version :-) )?</p>`,
  edit_cell: '<p>After opening a table you can start editing any cell,</p><p> by just doubleclicking on it or by selecting and clicking enter</p>',
  constrains_check:
        `<h3>When you edit cell, Krya validates folowing constrains:</h3>
            <ol>
                <li>NULLABLE if cell is not nullable you can not finish edditing with empty value</li>
                <li>VARCHAR for varchar it checks that imputed string doesnot exceedi</li>
                <li>for BOOLEAN you can enter 0, 1, true or false. Result is displayed as V or X</li>
                <li>for INTEGER it checks weather input is correct int</li>
                <li>and finally for ENUM it <b>downloads</b> from database all possible values and displays it as a select list while edditing</li>
            </ol>
        `,
  filters:
        `<h3>You can filter data with a built-in MUI data grid filters or with custom filters</h3>
        <p>Default data grid filters allow to filter <b>one</b> column by value <i>"starts with", "contains", "empty"</i> etc. </p>
        <p>Custom filters allow to filter <b>multiple</b> columns with ">", "<" "=", "<=" and ">="</p>
        <p>Custom filters are saved to local memory</p>`,
  standart:
        `<h3>Data is presented in a convenient MUI data grid table</h3>
        <p>So all basic features of MUI data grid are available from the box</p>
        <ul>
            <li>Pagination</li>
            <li>Number of rows per page</li>
            <li>Sorting</li>
            <li>Hiding columns</li>
        </ul>`,
  add:
        `<p>Add a new row to a table</p>
         <p>Any colymn with <b>SERIAL</b> is handled automaticaly`,
  errors:
        `<p>When you are additing any cell and you break a constrain tow things happen:</p>
        <ol>
            <li>background of the cell becomes red</li>
            <li>SHOW ERRORS button becomes active</li>
        </ol>
        <p>By clicking SHOW ERRORS, you can watch what exactly you violated</p>`,
  save:
        `<p>When you edit cell you can escape edit mode by clicking ESC</p>
        <p>or you can press Enter or Tab to save data (to save and to move down, or save and move right)</p>
        <p>All changes are saved in connected database</p>
        <p>If for some reason error occures while saving it is displayed at the top of the screen (in the way database responds)</p>`,
  pk:
        `<p>By default Primary key is switched of and not displayed</p>
        <p>You can tune displayed columns by clicking settings icon and then "Displayed columns"</p>`,
};

export const positions = {
  standart: 'right',
  edit_cell: 'left',
  copy_version: 'top',
  save: 'top-end',
};
