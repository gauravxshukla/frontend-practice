import React from 'react';
import initialFileStructure from '../../data/fileStructure';
import FileExplorer from './FileExplorer';
import DataTable from './DataTable';


export default function StateManagementIndex() {
  return (
    <div>
      <h2>State Management</h2>
      <br />
      <FileExplorer initialFileStructure={initialFileStructure}/>
    </div>
  );
}
