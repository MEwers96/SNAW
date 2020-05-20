import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Alert from "./Alert";

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
});

/* TODO:: Finish displaying every type of data needed for the user Issue #15
   TODO:: Dynamically add rows and data from classification results and acoustic indices results Issue #16
*/

export default function AcousticIndiceTable(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="h6">Acoustic Indice Name</Typography></TableCell>
            <TableCell align="right"><Typography variant="h6">Value</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.indices.map(row => (
              <TableRow key={row.index}>
                <TableCell align="left">
                  <Alert index={row.index} description={row.desc}/>
                </TableCell>
                <TableCell align="right">{row.value}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
