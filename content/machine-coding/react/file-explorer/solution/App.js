import { useState } from 'react';
import data from './data';

const isDirectory = (item) => Array.isArray(item.children);

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (isDirectory(a) !== isDirectory(b)) return isDirectory(a) ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function FileObject({ item }) {
  const [expanded, setExpanded] = useState(false);

  if (!isDirectory(item)) {
    return <li className="file-item">{item.name}</li>;
  }

  return (
    <li className="file-item">
      <button className="directory" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
        {item.name} [{expanded ? '-' : '+'}]
      </button>
      {expanded && <FileList items={item.children} />}
    </li>
  );
}

function FileList({ items }) {
  return (
    <ul className="file-list">
      {sortItems(items).map((item) => (
        <FileObject key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <div>
      <h1>File Explorer</h1>
      <FileList items={data} />
    </div>
  );
}
