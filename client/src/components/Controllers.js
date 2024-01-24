import { useSelector, useDispatch } from 'react-redux';
import {
  FormControl, InputLabel, MenuItem, Select, Button,
  Popper, MenuList, Paper, Grow, ClickAwayListener, Stack,
} from '@mui/material';
import { useState, useRef } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';

import {
  setTableName, openNewRow, toggleWelcome, validationErrors,
} from '../actions';
import { Filters } from './Filters';
import { ColumnsController } from './Columnscontroller';
import { ModelCopy } from './Modelcopy';
import { Errors } from './Errors';
import { $navigate } from '../utils/ux';

import './styles/Controllers.css';

export function Controllers() {
  const table_name = useSelector((state) => state.table_name);
  const tables = useSelector((state) => state.tables);
  const editing = useSelector((state) => state.editing);
  const primaryKey = useSelector((state) => state.primaryKey);

  // for menu button
  const menuRef = useRef(null);

  const [editColumns, openEditColumns] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const dispatch = useDispatch();

  const handleChangeTable = (e) => {
    dispatch(setTableName(e.target.value));
  };

  const handleOpenColumns = () => {
    openEditColumns(true);
    setSettingsMenuOpen(false);
  };

  const handleListKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      setSettingsMenuOpen(false);
    }
  };

  return (
    <div className="container controllers">
      <FormControl size="large" sx={{ m: 1, width: 192 }}>
        <InputLabel id="select-table-name">Table name</InputLabel>
        <Select
          labelId="select-table-name"
          id="table_name_select"
          value={table_name}
          label="Table name"
          onChange={handleChangeTable}
          disabled={editing}
        >
          <MenuItem disabled value="">
            <em>Select table name</em>
          </MenuItem>
          {tables.map((elt) => <MenuItem value={elt} key={elt}>{elt}</MenuItem>)}
        </Select>
      </FormControl>

      <Filters />

      <Button
        variant="contained"
        color="primary"
        disabled={editing || primaryKey === ''}
        onClick={() => {
          dispatch(validationErrors(0));
          dispatch(openNewRow(true));
        }}
        sx={{ whiteSpace: 'nowrap' }}
      >
        New row
      </Button>

      <ModelCopy />

      <Stack direction="row" alignItems="center" spacing={1} className="menu-right">
        <Errors />

        <SettingsIcon
          id="settings"
          ref={menuRef}
          onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
          aria-controls={settingsMenuOpen ? 'composition-menu' : undefined}
          aria-expanded={settingsMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
        />
      </Stack>

      <Popper
        open={settingsMenuOpen}
        anchorEl={menuRef.current}
        role="menu"
        placement="bottom-start"
        transition
        disablePortal
        style={{ zIndex: 2 }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'right top' }}
          >
            <Paper id="settings-menu" elevation={1}>
              <ClickAwayListener onClickAway={() => setSettingsMenuOpen(false)}>
                <MenuList
                  autoFocusItem={settingsMenuOpen}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleOpenColumns} disabled={editing || table_name === ''}>Displayed columns</MenuItem>
                  <MenuItem onClick={() => dispatch(toggleWelcome(true))}>Show instructions</MenuItem>
                  <MenuItem onClick={() => $navigate('loginregister')}>Login/Register</MenuItem>
                  <MenuItem onClick={() => $navigate('hotkeys')}>HotKeys</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <ColumnsController opener={openEditColumns} open={editColumns} />

    </div>
  );
}
