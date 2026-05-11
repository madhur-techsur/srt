import { useState } from 'react';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Simple Request Tracker</h1>
      <RequestForm onSuccess={handleSuccess} />
      <RequestList key={refreshKey} />
    </div>
  );
}

export default App;
