import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Logs({ logs }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ARS PK</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Time Elapsed</TableCell>
            <TableCell align="right">Result Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(logs).map(([pk, log]) => (
            <TableRow
              key={pk}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {pk}
              </TableCell>
              <TableCell align="right">{log.status_code}</TableCell>
              <TableCell align="right">{log.time_elapsed}</TableCell>
              <TableCell align="right">{log.result_count}</TableCell>
            </TableRow>
          ))}
          {Object.keys(logs).length === 0 && (
            <TableRow>
              <TableCell>No Logs Found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
