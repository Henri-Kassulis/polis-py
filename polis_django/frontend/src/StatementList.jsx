import { useEffect, useState } from 'react';

function StatementList({ topicId }) {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/topics/${topicId}/statements/`);
        const data = await response.json();
        setStatements(data);
      } catch (error) {
        console.error('Fehler beim Laden der Statements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, [topicId]);

  if (loading) return <div>Statements werden geladen…</div>;
  if (!statements.length) return <div>Keine Statements vorhanden.</div>;

  return (
    <ul>
      {statements.map((s) => (
        <li key={s.id}>{s.text}</li>
      ))}
    </ul>
  );
}

export default StatementList;
