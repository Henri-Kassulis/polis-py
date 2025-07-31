import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function CreateTopicForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/topics/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      navigate('/topics');
    } else {
      const data = await response.json();
      setMessage(`Fehler: ${JSON.stringify(data)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Neues Topic anlegen</h2>
      <div>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Beschreibung:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button type="submit">Anlegen</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default CreateTopicForm;
