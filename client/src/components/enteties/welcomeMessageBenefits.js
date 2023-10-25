export const benefits = {
    'copy_model' : 
    `<p>If a table has column named "model" you can copy all records with the same value in model column to a new model</p>
    <p> or to the same model but with different version</p>
    <p>To check this functionality select table "with_model"</p>
    <p> and press button "NEW VERSION" </p>`,
    'copy_version' : 
        `<p>If a given Model has different versions,</p>
        <p> you can copy just a desired version to a new version in the same or in another model</p>
        <p> On the final step you can eddit part of table you copy (otherwise what's the reason to create new version :-) )?</p>`,
    'edit_cell' : '<p>After opening a table you can start editing any cell,</p><p> by just doubleclicking on it or by selecting and clicking enter</p>',
    'constrains_check' : 
        `<h3>When you edit cell, Krya validates folowing constrains:</h3>
            <ol>
                <li>NULLABLE if cell is not nullable you can not finish edditing with empty value</li>
                <li>VARCHAR for varchar it checks that imputed string doesnot exceedi</li>
                <li>for BOOLEAN you can enter 0, 1, true or false. Result is displayed as V or X</li>
                <li>for INTEGER it checks weather input is correct int</li>
                <li>and finally for ENUM it <b>downloads</b> from database all possible values and displays it as a select list while edditing</li>
            </ol>
        `
}

// filters
// +1 row
// show errors
// displayed columns
// standar datagrid features (pagination/ sorting / switching columns)
// switching off PK
// save to database and display errors