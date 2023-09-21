import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useState } from 'react';
import UserService from '../../../services/user.service';
import ProjectType from '../../../types/project.type';

export default function ProjectList() {
  const [allProjects, setAllProjects] = useState<Array<ProjectType>>([]);

  const getAllExistingProjects = async () => {
    await UserService.getAllProjects().then((result) => {
      console.log(result);
      setAllProjects(result.data);
    });
  };

  async function onRemoveProjectClick(_id: string | undefined) {
    if (_id) {
      await UserService.deleteProject(_id).then(() => {
        alert('Project removed!');
        window.location.reload();
      });
    }
  }
  React.useEffect(() => {
    getAllExistingProjects();
  }, [allProjects.length]);

  return (
    <div>
      <Paper>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Project ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right"> </TableCell>
                <TableCell align="right"> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProjects.map((row) => (
                <TableRow key={row._id}>
                  <TableCell scope="row">{row._id}</TableCell>
                  <TableCell align="right">{row.title}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                  <TableCell align="right">
                    <a href={'/planner/' + row._id}>Edit</a>
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={() => onRemoveProjectClick(row._id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
