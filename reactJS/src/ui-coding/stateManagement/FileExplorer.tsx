import React, { useState } from 'react';

/*
  Component Design - 
  File Structure Component
  useState - fileStructure
  useEffect - 
  function - 
  props


  File
  name, 

*/

function File({ name }){
  return (
    <>
    <p>{name}</p>
    </>
  );
};

export default function FileExplorer({ initialFileStructure }){
  const [fileStructure, setFileStructure] = useState(initialFileStructure);
    return (
      <>
        {fileStructure.map((currentFile) => {
          return (
            <div key={currentFile?.id} style={{
              marginLeft: 4
            }}>
              <File name={currentFile?.name} />
              {
                currentFile?.children &&
                <FileExplorer initialFileStructure={currentFile?.children} />
              }
            </div>
          );
        })}
      </>
    );
};