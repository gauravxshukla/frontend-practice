import { useState } from 'react';

export default function App() {
  const [labels, setLabels] = useState([{ id: 1, name: 'Default Label', count: 0 }]);

  return (
    <div>
      <h1>Click Tracker</h1>
      {/* input + Add button, labels table, and the latest-click message */}
    </div>
  );
}
