import { useDispatch, useSelector } from 'react-redux';
import { InputLabel, Select, FormControl, MenuItem, Stack, Button, TextField, DialogTitle } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { chooseModel, chooseVersion, setNewTableRows, ACTIONS, openNewRow, setEditMode, setNewTableToDefault, validationErrors } from '../actions';
import { $alert, $loading} from '../utils/ux';
import { getData } from '../utils/api';
import CustomModal from './universal/CustomModal';

import { validateCellFailed } from './Validation';

export function ModelCopy(props) {
  const editing = useSelector((state) => state.editing);
  const models = useSelector((state) => state.models);
  const versions = useSelector((state) => state.versions);
  const cur_model = useSelector((state) => state.model);
  const cur_version = useSelector((state) => state.version);
  const root_url = useSelector((state) => state.root_url);
  const table_name = useSelector((state) => state.table_name);
  const constrains = useSelector((state) => state.constrains);

  const [modelsDialog, openModelsDialog] = useState(false);
  const [newModel, setNewModel] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [errorInModel, setErrInModel] = useState(false);
  const [errorInVersion, setErrInVersion] = useState(false);
  const [dataChanged, change] = useState(false);

  const dispatch = useDispatch();

  const handleChangeModel = (e) => {
    dispatch(chooseModel(e.target.value));
    dispatch(chooseVersion('All versions'));
  };

  const handleChangeVersion = (e) => {
    dispatch(chooseVersion(e.target.value));
  };

  const validate = useCallback((field, val) => {
    if (Object.keys(constrains).length > 0 && dataChanged) {
      const res = validateCellFailed({ props: { value: val } }, constrains[field], dispatch);
      return res;
    }
    return false;
  }, [constrains, dispatch, dataChanged]);

  useEffect(() => {
    setErrInVersion(validate('version', newVersion));
  }, [newVersion, cur_version, validate]);

  useEffect(() => {
    setErrInModel(validate('model', newModel));
  }, [newModel, cur_model, validate]);

  const goToEdit = async () => {
    const prepareTable = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      $loading(true);
      const data = await getData(`/api/table/${table_name}`,{ model : cur_model, version: cur_version });
      $loading(false)
      if (data) {
          const ed_table = data.map((elt) => ({ ...elt, model: newModel, version: newVersion }));
          dispatch(setNewTableRows(ed_table));
          openModelsDialog(false);
          dispatch(validationErrors(0));
          dispatch(openNewRow(true));
      } 
    };

    if (newModel === '' || newVersion === '')  return $alert('Should not be empty');

    if (!models.includes(newModel)) return prepareTable();

    $loading(true)
    const thisModelVersions = await getData(`/api/general/versions`, {table : table_name, model : newModel});
    $loading(false)
    if (!thisModelVersions) return 
    const thisModelVersionsStings = thisModelVersions.map((elt) => String(elt.version));
    if (thisModelVersionsStings.includes(String(newVersion))) return $alert(`Sorry, model "${newModel}" already has version "${newVersion}"`);
    prepareTable();
      
  };

  const onModelDialogClose = () => {
    openModelsDialog(false);
    dispatch(setEditMode(false));
    dispatch(setNewTableToDefault());
    change(false)
  }

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        disabled={editing || models.length === 0}
        onClick={() => { openModelsDialog(true); }}
        sx={{ whiteSpace: 'nowrap' }}
      >
        New version
      </Button>

      <CustomModal
        title='Please choose wich version to copy'
        show={modelsDialog}
        onClose={onModelDialogClose}
        success_text='Continue'
        onSuccess={goToEdit}
      >
        <Stack direction="row" alignItems="center" spacing={2} px={3} py={1}>
            <FormControl size="large" sx={{ width: 192 }}>
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
                {models.map((elt) => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
                <MenuItem value="All models"><span style={{ color: 'green' }}>All models</span></MenuItem>
              </Select>
            </FormControl>

            <FormControl size="large" sx={{ minWidth: 192 }}>
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
                {versions.map((elt) => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
                <MenuItem value="All versions"><span style={{ color: 'green' }}>All versions</span></MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <DialogTitle>Please choose destination model and version</DialogTitle>

          <Stack direction="row" alignItems="center" spacing={2} px={3}>
            <TextField
              id="model-input"
              label="model"
              variant="standard"
              error={errorInModel}
              required
              onChange={
                        (e) => {
                          setNewModel(e.target.value);
                          change(true);
                        }
                    }
              sx={{ width: 192 }}
            />
            <TextField
              id="version-input"
              label="version"
              variant="standard"
              required
              error={errorInVersion}
              onChange={(e) => {
                setNewVersion(e.target.value);
                change(true);
              }}
              sx={{ width: 192 }}
            />
          </Stack>

      </CustomModal>

    </>
  );
}
