import { useEffect, useState } from 'react';

const PAGE_SIZES = [5, 10, 20];

export default function App() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let ignore = false;
    setStatus('loading');

    fetch(`https://dummyjson.com/posts?limit=${pageSize}&skip=${(page - 1) * pageSize}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        setPosts(data.posts);
        setTotal(data.total);
        setStatus('idle');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <h1>Posts</h1>
      {status === 'error' && <p role="alert">Couldn't load posts. Try again.</p>}
      {status === 'loading' && <p>Loading…</p>}
      {status === 'idle' &&
        posts.map((post) => (
          <article key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </article>
        ))}

      <div className="pagination">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          aria-label="Page size"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
