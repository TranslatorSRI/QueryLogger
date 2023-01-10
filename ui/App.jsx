import React, { useState, useEffect, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import Logs from './Logs';

import './app.css';
import cssTheme from './cssTheme.json';

const theme = createTheme(cssTheme);

export default function App() {
  // const [ars_urls, set_ars_urls] = useState([]);
  const [aras, set_aras] = useState([]);
  const [ara, set_ara] = useState('');
  const [logs, set_logs] = useState(null);
  const [loading_aras, set_loading_aras] = useState(true);
  const [loading_logs, set_loading_logs] = useState(false);

  useEffect(() => {
    fetch('/api/aras')
      .then((res) => res.json())
      .then((data) => {
        set_aras(data);
        set_loading_aras(false);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    set_logs(null);
  }, [ara]);

  const get_logs = useCallback(() => {
    set_loading_logs(true);
    fetch(`/api/logs?${new URLSearchParams({
      ars_url: 'https://ars-dev.transltr.io/ars/api/reports',
      ara,
    })}`)
      .then((res) => res.json())
      .then((data) => {
        set_logs(data);
        set_loading_logs(false);
      })
      .catch((err) => console.error(err));
  }, [ara]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div id="mainContainer">
          <h1 id="header">DEV ARS Query Logger</h1>
          {!loading_aras ? (
            <>
              <Autocomplete
                className="araSelector"
                disablePortal
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
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
