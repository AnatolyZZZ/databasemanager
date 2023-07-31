import { useSelector, useDispatch } from 'react-redux';
import {FormControl, InputLabel, MenuItem, Select, FormControlLabel, FormGroup, Checkbox, Button} from '@mui/material';
import { setTableName, toggleSelected, openNewRow, openOnCellErrorMessage, chooseModel, chooseVersion, setEditMode } from '../actions';
import { useState, useEffect } from 'react'
// import Paper from '@mui/material/Paper';
import { Dialog , DialogActions, DialogContent, DialogTitle, TextField, Box}from '@mui/material';
// import Draggable from 'react-draggable';
import { useHotkeys } from 'react-hotkeys-hook';
import { Table } from './Table';
import { validateCellFailed } from './Validation'
import './Controllers.css'


export const Controllers = (props) => {
    const table_name = useSelector(state => state.table_name);
    const tables = useSelector(state => state.tables);
    const selected_columns = useSelector(state => state.selected_columns);
    const editing = useSelector(state => state.editing);
    const errorMessages = useSelector(state => state.errorMessages);
    const primaryKey = useSelector(state => state.primaryKey);
    // initial value for primary key to mach datatype
    const table = useSelector(state => state.table);
    const onCellErrorMessage = useSelector(state => state.onCellErrorsMessage);
    const models = useSelector(state => state.models);
    const cur_model = useSelector(state => state.model);
    const versions = useSelector(state => state.versions);
    const cur_version = useSelector(state => state.version);
    const constrains = useSelector(state => state.constrains)
    // console.log(constrains['model'])
    
    const [editColumns, openEditColumns] = useState(false);
    const [modelsDialog, openModelsDialog] = useState(false);
    const [cloningVersion, openCloningVersion] = useState(false);
    const [newVersion, setNewVersion] = useState('');
    const [errorInVersion, setErrInVersion] = useState(false);
    const [newModel, setNewModel] = useState('')
    const [errorInModel, setErrInModel] = useState(false);
    // strange problem appeared: when using hotkey both useHotkey and pressing button happens 
    // so first Hotkey changes onCellErrorMessage to false then button shows it again 
    // therefore I'm using this additional state
    const [closedByHotkey, setClosedByHotkey] = useState(false);
    const dispatch = useDispatch();

    const handleChangeTable = (e) => {
        dispatch(setTableName(e.target.value));
    }

    const handleChangeModel = (e) => {
        dispatch(chooseModel(e.target.value));
        dispatch(chooseVersion('All versions'));
    }

    const handleColumsCheck = (idx) => {
        dispatch(toggleSelected(idx))
    }

    const handleChangeVersion = (e) => {
        dispatch(chooseVersion(e.target.value));
    }
    
    const validate = (field, val) => {
        if (Object.keys(constrains).length > 0) {
            const res = validateCellFailed({props : {value : val}}, constrains[field], dispatch);
            console.log(field, res)
            return res
        } else {
            console.log('no constrains')
            return false
        }
    }

    useEffect(()=> {
        setErrInVersion(validate('version', newVersion))
    }, [newVersion])

    useEffect(()=> {
        setErrInModel(validate('model', newModel))
    }, [newModel])

    useHotkeys('enter', () => {
        dispatch(openOnCellErrorMessage(false));
        setClosedByHotkey(true);
        setTimeout(() => {
            setClosedByHotkey(false)
        }, 100);
    });


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
    


    <Button 
        variant="contained" 
        color='secondary'
        disabled={editing || table_name===''}
        onClick={(e) =>  {openEditColumns(true)}}>
            Select columns
    </Button>

    <Dialog disableEscapeKeyDown open={editColumns}>
        <DialogTitle>Which columns to display?</DialogTitle>

        <DialogContent>
            <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                <FormGroup>
                    {selected_columns.map((elt, idx) => 
                        <FormControlLabel
                        key={idx}
                        control={
                        <Checkbox checked={elt[1]} onChange={(e) => handleColumsCheck(idx)} name={elt[0]} />
                        }
                        label={elt[0] === primaryKey ? `${elt[0]} (PK)` : elt[0]}
                    />
                )}
                </FormGroup>
            </FormControl>
        </DialogContent>
        
        <DialogActions>
            <Button onClick={()=> openEditColumns(false) }>Ok</Button>
        </DialogActions>
    </Dialog>
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
            Clone version
    </Button>

    <Dialog disableEscapeKeyDown open={cloningVersion}>
        <DialogTitle>You are up to clone model <span style={{color : 'red'}}>{cur_model}</span>, version <span style={{color : 'red'}}>{cur_version}</span></DialogTitle>

        <DialogContent>
            <p>Please choose new model and version</p>
            <Box sx={{display: 'flex', gap : 3}}>
                <TextField 
                    id="model-input" 
                    label="New model" 
                    variant="standard" 
                    error={errorInModel}
                    onChange={(e)=>setNewModel(e.target.value)}/>
                <TextField 
                    id="version-input" 
                    label="New version" 
                    variant="standard"
                    error={errorInVersion}
                    onChange={(e)=>setNewVersion(e.target.value)} />
            </Box>
            
        </DialogContent>
        
        <DialogActions>
            <Button onClick={()=> {
                openCloningVersion(false) 
                dispatch(setEditMode(false))
                }}>Cancel</Button>
            <Button onClick={()=> {
                dispatch(openOnCellErrorMessage(true))
                dispatch(setEditMode(true))
                }}>Errors</Button>
        </DialogActions>
    </Dialog>



    <Button 
        variant='outlined'
        disabled={!editing}
        onClick={()=>{
            if (!closedByHotkey) {
                dispatch(openOnCellErrorMessage(!onCellErrorMessage))
                setClosedByHotkey(false)
            }
        }}
        id='open-error-dialog-button'>
            Show errors
        </Button>

    <Dialog 
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
    </Dialog>

    </div>
}