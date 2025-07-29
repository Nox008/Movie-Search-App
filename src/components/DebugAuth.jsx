// DebugAuth.jsx - Temporary component to test authentication
import { useState, useEffect } from 'react';

const DebugAuth = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setTokenInfo({ exists: false, message: 'No token found' });
      return;
    }

    try {
      // Decode JWT payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp && payload.exp < currentTime;
      
      setTokenInfo({
        exists: true,
        token: token.substring(0, 20) + '...',
        payload,
        isExpired,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiry',
        currentTime: new Date().toLocaleString()
      });
    } catch (error) {
      setTokenInfo({ 
        exists: true, 
        error: 'Invalid token format',
        token: token.substring(0, 20) + '...'
      });
    }
  };

  const testServerAuth = async () => {
    setError(null);
    setServerResponse(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token to test');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setServerResponse({
        status: response.status,
        ok: response.ok,
        data
      });
    } catch (error) {
      setError('Network error: ' + error.message);
    }
  };

  const testBookmarksEndpoint = async () => {
    setError(null);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token to test');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Bookmarks test:', { status: response.status, data });
      alert(`Bookmarks test: ${response.status} - ${JSON.stringify(data)}`);
    } catch (error) {
      setError('Bookmarks test error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#f5f5f5' }}>
      <h2>Authentication Debug</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd' }}>
        <h3>Token Information:</h3>
        <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={checkToken} style={{ marginRight: '10px', padding: '5px 10px' }}>
          Refresh Token Info
        </button>
        <button onClick={testServerAuth} style={{ marginRight: '10px', padding: '5px 10px' }}>
          Test Server Auth
        </button>
        <button onClick={testBookmarksEndpoint} style={{ padding: '5px 10px' }}>
          Test Bookmarks Endpoint
        </button>
      </div>

      {serverResponse && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd' }}>
          <h3>Server Response:</h3>
          <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', color: '#d32f2f' }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DebugAuth;