import { useState } from 'react';
import users from './users';

const COLUMNS = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'Occupation', key: 'occupation' },
];
const PAGE_SIZES = [5, 10, 20];

function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}

function UsersTable({ rows }) {
  return (
    <table>
      <thead>
        <tr>
          {COLUMNS.map(({ label, key }) => (
            <th key={key}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ id, name, age, occupation }) => (
          <tr key={id}>
            <td>{id}</td>
            <td>{name}</td>
            <td>{age}</td>
            <td>{occupation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PaginationControls({ page, totalPages, pageSize, onPageChange, onPageSizeChange }) {
  return (
    <div className="pagination">
      <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} aria-label="Page size">
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  return (
    <div>
      <h1>Data Table</h1>
      <UsersTable rows={paginate(users, page, pageSize)} />
      <PaginationControls
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
