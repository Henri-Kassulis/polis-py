import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StatementList from './StatementList';

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/topics/${id}/`)
      .then(res => res.json())
      .then(data => setTopic(data))
      .catch(console.error);
  }, [id]);

  if (!topic) return <div>Lädt...</div>;

  return (
    
    <div style={{ padding: '1rem' }}>
      <Link to="/topics">Zur Themenübersicht</Link>
      <Link to={`/topics/${topic.id}/vote`} >Abstimmen</Link>
      <Link to={`/topics/${topic.id}/add-statement`} >  Aussage hinzufügen</Link>
      <Link to={`/topics/${topic.id}/statements/bulk`}>  Mehrere Aussagen hinzufügen</Link>
      <Link to={`/topics/${topic.id}/results`}>  Ergebnisse</Link>
      
      <h2>{topic.name}</h2>
      <p>{topic.description}</p>

      <h3>Statements</h3>
      <StatementList topicId={topic.id} />
    </div>
  );
}
