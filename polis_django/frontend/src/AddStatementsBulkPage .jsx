import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddStatementsBulkPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/topics/${topicId}/statements/bulk/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fehler beim Anlegen der Aussagen');
      }

      navigate(`/topics/${topicId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Mehrere Aussagen hinzufügen</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Gib hier mehrere Aussagen ein, jeweils eine pro Zeile.\nBeispiel:\nDie Mieten sind zu hoch.\nWeniger Autos in der Stadt.\nMehr Platz für Fahrräder."}
          required
          rows={10}
        />
        {error && <p>{error}</p>}
        <div>
          <button type="submit">Alle speichern</button>
          <button type="button" onClick={() => navigate(-1)}>Zurück</button>
        </div>
      </form>
    </div>
  );
};

export default AddStatementsBulkPage;
