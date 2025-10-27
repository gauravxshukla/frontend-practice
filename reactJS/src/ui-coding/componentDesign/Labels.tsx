import React, { useState, useRef,  } from 'react';

function Label({ name, handleLabelClick }) {
    return (
      <tr>
        <td>
          <button className="table-label" onClick={() => handleLabelClick()}>
            {name}
          </button>
        </td>
      </tr>
    );
};

export default function Labels() {
    const [labels, setLabels] = useState([
      { id: 1, name: "Default Label", count: 0 },
    ]);
    const [labelSelected, setLabelSelected] = useState(null);
    const labelSwitched = useRef("");
    const [labelName, setLabelName] = useState("");
  
    const handleAdd = () => {
      console.log("Add button clicked");
      // Candidate should implement adding label logic
      const nextLabelId = labels.length + 1;
      setLabels((prev) => [
        ...prev,
        { id: nextLabelId, name: labelName, count: 0 },
      ]);
      setLabelName("");
    };
  
    const handleLabelClick = (Id) => {
      // Counter Logic
      let newLabels = [...labels];
  
      newLabels.map((currentLabel) => {
        if (currentLabel.id === Id) {
          currentLabel.count += 1;
        }
      });
      setLabels([...newLabels]);
  
      // Display Logic
      if (!labelSelected) {
        let selectedLabel = labels.filter(
          (currentLabel) => currentLabel.id === Id
        );
        setLabelSelected(...selectedLabel);
        labelSwitched.current = selectedLabel[0].name;
      } else {
        let selectedLabel = labels.filter(
          (currentLabel) => currentLabel.id === Id
        );
        labelSwitched.current = selectedLabel[0].name;
        if (labelSelected.id === selectedLabel[0].id) {
          labelSwitched.current = "";
        }
        setLabelSelected(...selectedLabel);
      }
      // Candidate should implement counter + display logic
    };
  
    return (
      <div className="App">
        <h1>Click Tracker</h1>
        <input
          placeholder="Enter label"
          value={labelName}
          onChange={(e) => {
            setLabelName(e.target.value);
          }}
        />
        <button onClick={handleAdd}>Add</button>
  
        <table className="table-container" border="1">
          <thead>
            <tr>
              <th>Labels</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((currentLabel) => {
              return (
                <Label
                  key={currentLabel?.id}
                  name={currentLabel?.name}
                  handleLabelClick={() => handleLabelClick(currentLabel?.id)}
                />
              );
            })}
          </tbody>
        </table>
  
        <div className="interaction-result">
          {/* Candidate should render latest clicked label here */}
          {labelSelected !== null && (
            <>
              <p>{`Latest Label clicked - ${labelSelected.name} ${labelSelected.count}`}</p>
              {labelSwitched.current !== "" && (
                <p>{`Switched to Label ${labelSwitched.current}`}</p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  