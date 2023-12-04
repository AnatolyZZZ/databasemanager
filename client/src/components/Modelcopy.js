import {useDispatch, useSelector} from 'react-redux'
import { Dialog, DialogActions, DialogContent, InputLabel, Select, FormControl, MenuItem, Stack, Button, TextField, DialogTitle } from '@mui/material';
import { chooseModel, chooseVersion, setAlertError, setAlertErrorMessage, setLoading, setNewTableRows, ACTIONS, openNewRow, setEditMode } from '../actions';
import { useState, useEffect, useCallback} from 'react';

import { validateCellFailed } from './Validation'

export const ModelCopy = (props) => {
    const editing = useSelector(state => state.editing);
    const models = useSelector(state => state.models);
    const versions = useSelector(state => state.versions);
    const cur_model = useSelector(state => state.model);
    const cur_version = useSelector(state => state.version);
    const root_url = useSelector(state => state.root_url);
    const table_name = useSelector(state => state.table_name);
    const constrains = useSelector(state => state.constrains);
    const primaryKey = useSelector(state => state.primaryKey);
    const editable_columns = useSelector(state => state.editable_columns);

    const [modelsDialog, openModelsDialog] = useState(false);
    const [newModel, setNewModel] = useState('');
    const [newVersion, setNewVersion] = useState('');
    const [errorInModel, setErrInModel] = useState(false);
    const [errorInVersion, setErrInVersion] = useState(false);
    const [dataChanged, change ] = useState(false);
    
    const dispatch = useDispatch();

    const handleChangeModel = (e) => {
        dispatch(chooseModel(e.target.value));
        dispatch(chooseVersion('All versions'));
    }


    const handleChangeVersion = (e) => {
        dispatch(chooseVersion(e.target.value));
    }

    const setNewTableRowToDefault = ()=> {
        const editRow = [{[primaryKey] : 1}];
        editable_columns.forEach(elt => editRow[0][elt]='');
        dispatch(setNewTableRows(editRow))
    }

    const validate = useCallback((field, val) => {
        if (Object.keys(constrains).length > 0 && dataChanged) {
            const res = validateCellFailed({props : {value : val}}, constrains[field], dispatch);
            return res
        } else {
            return false
        }}, [ constrains, dispatch, dataChanged])
    

    useEffect(()=> {
        setErrInVersion(validate('version', newVersion))
    }, [newVersion, cur_version, validate])

    useEffect(()=> {
        setErrInModel(validate('model', newModel))
    }, [newModel, cur_model, validate])

    const goToEdit = async () => {
        const prepareTable = async () => {
            dispatch({type: ACTIONS.SET_LOADING, payload: true})
            try {
                const res = await fetch(`${root_url}/api/table/${table_name}?model=${cur_model}&version=${cur_version}`);
                // console.log(res)
                const data = await res.json();
                // console.log(data)
                if (res.status === 200) {
                    const ed_table = data.map(elt => {return {...elt, model  : newModel, version : newVersion}})
                    dispatch(setLoading(false));
                    dispatch(setNewTableRows(ed_table));
                    openModelsDialog(false);
                    dispatch(openNewRow(true));
                } else {
                    console.log('throw')
                    throw new Error('Failed to load data, please try again')
                }
            } catch (error) {
                // console.log('catch in prepare table')
                dispatch(setAlertErrorMessage(JSON.stringify(error)))
                dispatch(setAlertError(true))
                dispatch(setLoading(false));
            }
        }

        if (newModel === '' || newVersion === '') {
            dispatch(setAlertErrorMessage(`Should not be empty`));
            dispatch(setAlertError(true));
        } else 
            if (models.includes(newModel)) {
                dispatch({type: ACTIONS.SET_LOADING, payload: true})
            try {
                const res = await fetch(`${root_url}/api/general/versions?table=${table_name}&model=${newModel}`);
                const thisModelVersions = await res.json();
                if (res.status !== 200) {
                    throw new Error('Something went wrong, please try again')
                } else if (thisModelVersions.map(elt => String(elt.version)).includes(String(newVersion))) {
                    // console.log('includes', thisModelVersions)
                    dispatch(setAlertErrorMessage(`Sorry, model "${newModel}" already has version "${newVersion}"`));
                    dispatch(setAlertError(true));
                    dispatch(setLoading(false))
                }  else { 
                    prepareTable() 
                }
            } catch (error) {
                dispatch(setAlertErrorMessage(JSON.stringify(error)));
                dispatch(setAlertError(true));
                dispatch(setLoading(false))
            }
        } else {
            prepareTable()
        }
    }

return <>
 <Button 
        variant='contained'
        color='warning'
        disabled={editing || models.length === 0}
        onClick={()=>{openModelsDialog(true)}}
        sx={{whiteSpace : 'nowrap'}}>
            New version
</Button>

<Dialog open={modelsDialog}>
        <DialogContent>
            <DialogTitle>Please choose wich version to copy</DialogTitle>
            <Stack direction='row' alignItems='center' spacing={2} px={3}>
                <FormControl size='large' sx={{ width : 192}}>
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

                <FormControl size='large' sx={{minWidth : 192}}>
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
            </Stack> 

            <DialogTitle>Please choose destination model and version</DialogTitle>
            <Stack  direction='row' alignItems="center" spacing={2} px={3}>
                <TextField 
                    id="model-input" 
                    label="model" 
                    variant="standard" 
                    error={errorInModel}
                    required
                    onChange={
                        (e)=> {
                            setNewModel(e.target.value) 
                            change(true)
                        }
                    }
                    sx={{ width : 192}}/>
                <TextField 
                    id="version-input" 
                    label="version" 
                    variant="standard"
                    required
                    error={errorInVersion}
                    onChange={(e)=> {
                        setNewVersion(e.target.value)
                        change(true)
                        }
                    }
                    sx={{ width : 192}} />
            </Stack>
            
        </DialogContent>
        
        <DialogActions>
            <Button onClick={()=> {
                openModelsDialog(false);
                dispatch(setEditMode(false));
                setNewTableRowToDefault();
                }}>Cancel</Button>
            {/* <Button onClick={()=> {
                dispatch(openOnCellErrorMessage(true))
                dispatch(setEditMode(true))
                }}>Errors</Button> */}
            <Button onClick={()=> {goToEdit()}}>Continue</Button>
      
        </DialogActions>
    </Dialog>

</>
}