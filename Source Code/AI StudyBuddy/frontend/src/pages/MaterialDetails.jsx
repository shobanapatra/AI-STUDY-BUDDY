import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const fetchMaterial = async () => {
    try {
      const res = await API.get(`/materials/${id}`);

      console.log('FULL MATERIAL RESPONSE:', res.data);
      console.log('MATERIAL OBJECT:', res.data.material);

      setMaterial(res.data.material);
    } catch (err) {
      console.error('FETCH MATERIAL ERROR:', err);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, [id]);

  const generateAIContent = async (type) => {
    setLoading(true);

    try {
      // Frontend uses studyPlan, backend route uses studyplan
      const apiType = type === 'studyPlan' ? 'studyplan' : type;

      const res = await API.post(
        `/materials/${id}/${apiType}`
      );

      console.log('AI RESPONSE:', res.data);

      // Update immediately
      setMaterial((prev) => ({
        ...prev,
        [type]: res.data[type],
      }));

      // Fetch latest saved material
      await fetchMaterial();
    } catch (err) {
      console.error(`Failed to generate ${type}:`, err);

      alert(
        err.response?.data?.message ||
          `Failed to generate ${type}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!material) {
    return (
      <p style={{ textAlign: 'center', marginTop: '50px' }}>
        Loading...
      </p>
    );
  }

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '30px auto',
        padding: '20px',
      }}
    >
      <button
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px' }}
      >
        &larr; Back to Dashboard
      </button>

      <h2>{material.title}</h2>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          margin: '20px 0',
        }}
      >
        {['summary', 'flashcards', 'quiz', 'studyPlan'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 15px',
                fontWeight:
                  activeTab === tab ? 'bold' : 'normal',
                backgroundColor:
                  activeTab === tab
                    ? '#e0e0e0'
                    : '#f5f5f5',
                cursor: 'pointer',
              }}
            >
              {tab.toUpperCase()}
            </button>
          )
        )}
      </div>

      <div
        style={{
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          minHeight: '200px',
        }}
      >
        {loading ? (
          <p>Generating AI output with Gemini...</p>
        ) : (
          <div>
            {!material[activeTab] ? (
              <div>
                <p>
                  No {activeTab} generated yet.
                </p>

                <button
                  onClick={() =>
                    generateAIContent(activeTab)
                  }
                  style={{
                    padding: '8px 16px',
                    cursor: 'pointer',
                  }}
                >
                  Generate {activeTab.toUpperCase()}
                </button>
              </div>
            ) : (
              <div>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                  }}
                >
                  {typeof material[activeTab] === 'string'
                    ? material[activeTab]
                    : JSON.stringify(
                        material[activeTab],
                        null,
                        2
                      )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}