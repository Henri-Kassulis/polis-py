import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddStatementPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/topics/${topicId}/statements/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: content,
          topic: parseInt(topicId)           
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fehler beim Anlegen des Statements');
      }

      // Zurück zur Topic-Detailseite navigieren
      navigate(`/topics/${topicId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Statement hinzufügen</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dein Statement hier..."
          required
          rows={5}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Speichern
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:underline"
          >
            Zurück
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStatementPage;
