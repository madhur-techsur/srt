import { useEffect, useState } from 'react';
import { getRequests } from '../api/requestsApi';
import type { Request } from '../types/request';

function RequestList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getRequests()
      .then((data) => {
        setRequests(data);
      })
      .catch(() => {
        setError('Could not load requests.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p data-testid="error-state">{error}</p>;
  }

  if (requests.length === 0) {
    return <p data-testid="empty-state">No requests yet.</p>;
  }

  return (
    <table data-testid="request-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1.5rem' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Name</th>
          <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Title</th>
          <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Description</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => (
          <tr key={req.id}>
            <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{req.name}</td>
            <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{req.title}</td>
            <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{req.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RequestList;
