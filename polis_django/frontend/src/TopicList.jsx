import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function TopicList() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/topics/')
      .then((res) => res.json())
      .then((data) => setTopics(data))
      .catch((err) => console.error('Fehler beim Laden:', err));
  }, []);

  return (
    <div>
      <h2>Konversationen</h2>
      <Link to={`/topics/create`}>Thema anlegen</Link>
      
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link to={`/topics/${topic.id}`}>{topic.name}</Link>-  {topic.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicList;
