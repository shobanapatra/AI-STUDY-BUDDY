import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [title, setTitle] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMaterials = async () => {
    try {
      const res = await API.get('/materials');
      setMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch materials', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file && !originalText.trim()) {
      alert('Please enter study text or select a file.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('title', title);

      if (originalText.trim()) {
        formData.append('originalText', originalText);
      }

      if (file) {
        formData.append('file', file);
      }

      await API.post('/materials/upload', formData);

      setTitle('');
      setOriginalText('');
      setFile(null);

      // Reset the file input
      e.target.reset();

      await fetchMaterials();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>AI StudyBuddy Dashboard</h2>

        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <h3>Upload New Study Material</h3>

        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '10px' }}>
            <label>Title:</label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Upload File:</label>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0] || null)}
              style={{
                display: 'block',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Or enter Content / Study Text:</label>

            <textarea
              rows="5"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '5px',
              }}
            />
          </div>

          <p style={{ color: '#666', fontSize: '14px' }}>
            You can upload a file, enter study text, or provide both.
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Uploading...' : 'Upload Material'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Your Study Materials</h3>

        {materials.length === 0 ? (
          <p>No materials uploaded yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {materials.map((item) => (
              <li
                key={item._id}
                onClick={() => navigate(`/materials/${item._id}`)}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                }}
              >
                <h4>{item.title}</h4>

                <p style={{ color: '#666', fontSize: '14px' }}>
                  Uploaded:{' '}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}