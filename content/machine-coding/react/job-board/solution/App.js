import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 6;
const API = 'https://hacker-news.firebaseio.com/v0';

async function fetchJobIds() {
  const res = await fetch(`${API}/jobstories.json`);
  return res.json();
}

async function fetchJob(id) {
  const res = await fetch(`${API}/item/${id}.json`);
  return res.json();
}

function JobPosting({ job }) {
  const title = job.url ? (
    <a href={job.url} target="_blank" rel="noopener noreferrer">
      {job.title}
    </a>
  ) : (
    job.title
  );

  return (
    <div className="job">
      <h3>{title}</h3>
      <p className="job-meta">
        By {job.by} · {new Date(job.time * 1000).toLocaleString()}
      </p>
    </div>
  );
}

export default function App() {
  const jobIds = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      setLoading(true);
      if (!jobIds.current) jobIds.current = await fetchJobIds();
      const start = page * PAGE_SIZE;
      const pageJobs = await Promise.all(jobIds.current.slice(start, start + PAGE_SIZE).map(fetchJob));
      if (ignore) return;
      setJobs((prev) => [...prev, ...pageJobs]);
      setLoading(false);
    }

    loadPage();
    return () => {
      ignore = true;
    };
  }, [page]);

  const hasMore = !jobIds.current || jobs.length < jobIds.current.length;

  return (
    <div className="board">
      <h1>Hacker News Jobs Board</h1>
      {jobs.length === 0 && loading ? (
        <p>Loading…</p>
      ) : (
        <>
          {jobs.map((job) => (
            <JobPosting key={job.id} job={job} />
          ))}
          {hasMore && (
            <button className="load-more" disabled={loading} onClick={() => setPage((p) => p + 1)}>
              {loading ? 'Loading…' : 'Load more jobs'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
