import { useSelector, useDispatch } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select, Button, Popper, MenuList, Paper, Grow,  Dialog , DialogActions, DialogContent, DialogTitle, TextField, Box, ClickAwayListener} from '@mui/material';
import { setTableName,  openNewRow, chooseModel, chooseVersion, setEditMode, setAlertErrorMessage, setAlertError, setNewTableRows } from '../actions';
import { useState, useEffect, useRef} from 'react';
import { Filters } from './Filters';
import { ColumnsController } from './Columnscontroller';
import { Errors } from './Errors';

import SettingsIcon from '@mui/icons-material/Settings';

import { validateCellFailed } from './Validation'
import './Controllers.css'


export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const tables = useSelector(state => state.tables);
    const editing = useSelector(state => state.editing);
    const primaryKey = useSelector(state => state.primaryKey);
    // initial value for primary key to mach datatype
    const table = useSelector(state => state.table);
    const models = useSelector(state => state.models);
    const cur_model = useSelector(state => state.model);
    const versions = useSelector(state => state.versions);
    const cur_version = useSelector(state => state.version);
    const constrains = useSelector(state => state.constrains);
    const root_url = useSelector(state => state.root_url);
    const editable = useSelector(state => state.editable_columns);
    // console.log(editable)

    // for menu button
    const menuRef = useRef(null);
    
    const [editColumns, openEditColumns] = useState(false);
    const [modelsDialog, openModelsDialog] = useState(false);
    const [cloningVersion, openCloningVersion] = useState(false);
    const [newVersion, setNewVersion] = useState('');
    const [errorInVersion, setErrInVersion] = useState(false);
    const [newModel, setNewModel] = useState('')
    const [errorInModel, setErrInModel] = useState(false);
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
    
    const dispatch = useDispatch();

    const handleChangeTable = (e) => {
        dispatch(setTableName(e.target.value));
    }

    const handleChangeModel = (e) => {
        dispatch(chooseModel(e.target.value));
        dispatch(chooseVersion('All versions'));
    }


    const handleChangeVersion = (e) => {
        dispatch(chooseVersion(e.target.value));
    }

    const handleOpenColumns = (e) => {
        openEditColumns(true);
        setSettingsMenuOpen(false);
    }

    const handleListKeyDown = (e) => {
        if (e.key === 'Tab' || e.key === 'Escape') {
        setSettingsMenuOpen(false);
        }
    }

    const setNewTableRowToDefault = ()=> {
        console.log('runing', editable)
        const editRow = [{[primaryKey] : 1}];
        editable.forEach(elt => editRow[0][elt]='');
        dispatch(setNewTableRows(editRow))
    }

    const goToEdit = async () => {
        const prepareTable = () => {
            const ed_table = table.map(elt => {return {...elt, model  : newModel, version : newVersion}})
            dispatch(setNewTableRows(ed_table));
            openCloningVersion(false);
            dispatch(openNewRow(true));
        }
        if (newModel === '' || newVersion === '') {
            dispatch(setAlertErrorMessage(`Should not be empty`));
            dispatch(setAlertError(true));
        } else 
            if (models.includes(newModel)) {
            try {
                const res = await fetch(`${root_url}/api/general/versions?table=${table_name}&model=${newModel}`);
                const thisModelVersions = await res.json();
                if( thisModelVersions.map(elt => String(elt.version)).includes(String(newVersion))) {
                    // console.log('includes', thisModelVersions)
                    dispatch(setAlertErrorMessage(`Sorry, model ${newModel} already has version ${newVersion}`));
                    dispatch(setAlertError(true));
                }  else { 
                    // console.log('doesnt')
                    prepareTable() 
                }
            } catch (error) {
                dispatch(setAlertErrorMessage(JSON.stringify(error)));
                dispatch(setAlertError(true));
            }
        } else {
            prepareTable()
        }
    }
    
    // using validate cell for validating model and verion inputs are filled correctly
    const validate = (field, val) => {
        if (Object.keys(constrains).length > 0) {
            const res = validateCellFailed({props : {value : val}}, constrains[field], dispatch);
            // console.log(field, res)
            return res
        } else {
            // console.log('no constrains')
            return false
        }
    }

    useEffect(()=> {
        setErrInVersion(validate('version', newVersion))
    }, [newVersion, cur_version])

    useEffect(()=> {
        setErrInModel(validate('model', newModel))
    }, [newModel, cur_model])

   


    return <div className="container controllers">
        <FormControl size='large' sx={{m: 1, width : 192}}>
        <InputLabel id="table_name_select_label">Table name</InputLabel>
            <Select
                labelId="table_name_select_label"
                id="table_name_select"
                value={table_name}
                label="Table name"
                onChange={handleChangeTable}
                disabled={editing}
            >   
                <MenuItem disabled value="">
                    <em>Select table name</em>
                 </MenuItem>
                {tables.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
            </Select>
        </FormControl>

    <Button 
        variant='outlined'
        color='secondary'
        disabled={editing || models.length === 0}
        onClick={()=>{openModelsDialog(true)}}>
            Models
    </Button>

    <Dialog disableEscapeKeyDown open={modelsDialog}>
        <DialogContent>
            <FormControl size='large' sx={{m: 1, width : 192}}>
            <InputLabel id="models_select_label">Model</InputLabel>
                <Select
                    labelId="model_select_label"
                    id="model_select"
                    value={cur_model}
                    label="Model"
                    onChange={handleChangeModel}
                    disabled={editing}
                >   
                    <MenuItem disabled value="">
                        <em>Select model</em>
                    </MenuItem>
                    {models.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
                    <MenuItem value='All models'><span style={{color : 'green'}}>All models</span></MenuItem>
                </Select>
            </FormControl> 

            <FormControl size='large' sx={{m: 1, width : 192}}>
            <InputLabel id="version_select_label">Version</InputLabel>
                <Select
                    labelId="version_select_label"
                    id="version_select"
                    value={cur_version}
                    label="Version"
                    onChange={handleChangeVersion}
                    disabled={editing || versions.length === 0}
                >   
                    <MenuItem disabled value="">
                        <em>Select version</em>
                    </MenuItem>
                    {versions.map(elt => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
                    <MenuItem value='All versions'><span style={{color : 'green'}}>All versions</span></MenuItem>
                </Select>
            </FormControl>  
          
        </DialogContent>

        <DialogActions>
            <Button onClick={()=> {openModelsDialog(false)} }>Ok</Button>
        </DialogActions>
    </Dialog>
    


    <Filters/>

    <Button
        variant='contained'
        color='primary'
        disabled = { editing || primaryKey==='' }
        onClick={(e) => {dispatch(openNewRow(true))}}>
            New row
    </Button>


    <Button
        variant='contained'
        color='warning'
        disabled = {editing || cur_model === 'All models' || cur_version === 'All versions'}
        onClick={(e) => {openCloningVersion(true)}}>
            Copy to new version
    </Button>

    <Dialog disableEscapeKeyDown open={cloningVersion}>
        <DialogTitle>You are up to clone model <span style={{color : 'red'}}>{cur_model}</span>, version <span style={{color : 'red'}}>{cur_version}</span></DialogTitle>

        <DialogContent>
            <p>Please choose destination model and version</p>
            <Box sx={{display: 'flex', gap : 3}}>
                <TextField 
                    id="model-input" 
                    label="model" 
                    variant="standard" 
                    error={errorInModel}
                    required
                    onChange={(e)=>setNewModel(e.target.value)}/>
                <TextField 
                    id="version-input" 
                    label="version" 
                    variant="standard"
                    required
                    error={errorInVersion}
                    onChange={(e)=>setNewVersion(e.target.value)} />
            </Box>
            
        </DialogContent>
        
        <DialogActions>
            <Button onClick={()=> {
                openCloningVersion(false);
                dispatch(setEditMode(false));
                setNewTableRowToDefault();
                }}>Cancel</Button>
            {/* <Button onClick={()=> {
                dispatch(openOnCellErrorMessage(true))
                dispatch(setEditMode(true))
                }}>Errors</Button> */}
            <Button onClick={()=> {goToEdit()}}>Next step</Button>
        </DialogActions>
    </Dialog>

    <Errors/>

    <SettingsIcon 
        id='settings' 
        ref={menuRef} 
        onClick={()=> setSettingsMenuOpen(!settingsMenuOpen)}
        aria-controls={settingsMenuOpen ? 'composition-menu' : undefined}
        aria-expanded={settingsMenuOpen ? 'true' : undefined}
        aria-haspopup="true"/>

    <Popper
        open={settingsMenuOpen}
        anchorEl={menuRef.current}
        role={'menu'}
        placement="bottom-start"
        transition
        disablePortal
        >
        {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
            style={{
            transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',}}>
            <Paper id='settings-menu'>
                <ClickAwayListener onClickAway={(e)=> setSettingsMenuOpen(false)}>
                  <MenuList
                    autoFocusItem={settingsMenuOpen}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleOpenColumns} disabled={editing || table_name===''}>Edit displayed columns</MenuItem>
                  </MenuList>
                </ClickAwayListener>
            </Paper>
        </Grow>
          )}
    </Popper>

    <ColumnsController opener={openEditColumns} open={editColumns}/>

    
    {/* <Dialog 
        open={onCellErrorMessage}
        id='#error-message-dialog'
     > 
        <DialogTitle id="#draggable-dialog-title">Error on currently editing cell:</DialogTitle>
        <DialogContent>
            {!editing ? "You are not edditing any cell" :
            (errorMessages.length === 0) ? 'No errors detected' : errorMessages.map((elt, idx) => <p key={idx}>{elt}</p>) }
        </DialogContent>

        <DialogActions>
            <Button onClick={()=> dispatch(openOnCellErrorMessage(false))}>Close</Button>
        </DialogActions>
    </Dialog> */}

    </div>
}