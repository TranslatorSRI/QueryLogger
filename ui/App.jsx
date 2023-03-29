/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Logs from './Logs';

import './app.css';
import cssTheme from './cssTheme.json';

const theme = createTheme(cssTheme);

export default function App() {
  const [ars_instances, set_ars_instances] = useState([]);
  const [selected_ars, set_selected_ars] = useState('');
  const [aras, set_aras] = useState([]);
  const [ara, set_ara] = useState('');
  const [logs, set_logs] = useState(null);
  const [loading_ars_urls, set_loading_ars_urls] = useState(true);
  const [loading_aras, set_loading_aras] = useState(false);
  const [loading_logs, set_loading_logs] = useState(false);

  useEffect(() => {
    fetch('/api/ars')
      .then((res) => res.json())
      .then((data) => {
        set_ars_instances(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        set_loading_ars_urls(false);
      });
  }, []);

  const handleArsSelector = useCallback((e) => {
    set_selected_ars(e.target.value);
    set_loading_aras(true);
    fetch(`/api/actors?${new URLSearchParams({
      ars_url: e.target.value,
    })}`)
      .then((res) => res.json())
      .then((data) => {
        set_aras(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        set_loading_aras(false);
      });
  }, [ars_instances]);

  useEffect(() => {
    set_logs(null);
  }, [ara, selected_ars]);

  const get_logs = useCallback(() => {
    set_loading_logs(true);
    fetch(`/api/logs?${new URLSearchParams({
      ars_url: selected_ars,
      ara,
    })}`)
      .then((res) => res.json())
      .then((data) => {
        set_logs(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        set_loading_logs(false);
      });
  }, [ara, selected_ars]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div id="mainContainer">
          <h1 id="header">ARS Query Logger</h1>
          {!loading_ars_urls ? (
            <>
              <FormControl
                sx={{
                  width: '50%',
                }}
              >
                <InputLabel id="ars_url_selector">ARS Environment</InputLabel>
                <Select
                  labelId="ars_url_selector"
                  value={selected_ars}
                  label="ARS Environment"
                  onChange={handleArsSelector}
                >
                  {ars_instances.map((ars_instance) => (
                    <MenuItem
                      key={ars_instance.url}
                      value={ars_instance.url}
                    >
                      {ars_instance['x-maturity']}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selected_ars && (
                <>
                  {!loading_aras ? (
                    <>
                      <Autocomplete
                        className="araSelector"
                        freeSolo
                        options={aras}
                        renderInput={(params) => <TextField {...params} label="ARA" />}
                        inputValue={ara}
                        onInputChange={(e, v) => set_ara(v)}
                      />
                      <Button
                        variant="contained"
                        onClick={get_logs}
                        disabled={!ara}
                      >
                        Load Logs
                      </Button>
                      {(logs !== null || loading_logs) && (
                        <div id="logsContainer">
                          <h2>Logs:</h2>
                          {!loading_logs ? (
                            <Logs logs={logs} />
                          ) : (
                            <div className="loading">
                              <CircularProgress size={100} />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="loading">
                      <CircularProgress size={300} />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="loading">
              <CircularProgress size={300} />
            </div>
          )}
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
