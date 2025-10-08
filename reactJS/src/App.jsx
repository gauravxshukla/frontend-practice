import { useState } from 'react';
import FetchData from './ui-coding/stateManagement/fetchData';
import DataTable from './ui-coding/stateManagement/DataTable';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>React Coding</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      {/* <FetchData /> */}
      <DataTable />
    </>
  );
};

export default App;
