
/*
import Cookies from "js-cookie";
import axios from "axios";

const userId = Cookies.get("userId");

await axios.post("/api/vote", {
  statementId: "abc123",
  vote: "agree",
  userId: userId, // mitgeben
});
*/

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';


export default function Vote() {
  const { topicId } = useParams();

  // Nutzer-UUID aus Cookie holen oder erzeugen
  const [userUuid, setUserUuid] = useState(null);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [finished, setFinished] = useState(false); // keine weiteren Aussagen
  const navigate = useNavigate();

  // beim Mount: UUID sicherstellen
  useEffect(() => {
    let uid = Cookies.get('user_uuid');
    if (!uid) {
      uid = uuidv4();
      Cookies.set('user_uuid', uid, { expires: 365 });
    }
    setUserUuid(uid);
  }, []);

  // Aussage laden
  const fetchNextStatement = useCallback(async (tid, uid) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/votes/${tid}/${uid}/`);
      if (res.status === 204 || res.status === 404) {
        // keine weitere Aussage verfügbar
        setStatement(null);
        setFinished(true);
      } else if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Fehler beim Laden der nächsten Aussage');
      } else {
        const data = await res.json();
        // erwarte { id, text }
        setStatement(data);
        setFinished(false);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial laden, sobald UUID da ist
  useEffect(() => {
    if (userUuid && topicId) {
      fetchNextStatement(topicId, userUuid);
    }
  }, [userUuid, topicId, fetchNextStatement]);

  // Votum absenden
  async function submitVote(choice) {
    if (!statement || !userUuid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/votes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: parseInt(topicId, 10),
          statement: statement.id,
          user_uuid: userUuid,
          vote: choice, // "agree" | "neutral" | "disagree"
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Fehler beim Speichern der Stimme');
      }
      // nächste Aussage laden
      await fetchNextStatement(topicId, userUuid);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2>Abstimmen</h2>

      <button onClick={() => navigate(-1)}>Zurück zum Thema</button>

      {loading && <p>Lädt...</p>}

      {error && (
        <p>{error}</p>
      )}

      {!loading && finished && (
        <div>
          <p>Es gibt derzeit keine weiteren Aussagen für dieses Topic.</p>
        </div>
      )}

      {!loading && statement && (
        <div>
          <p><strong>Aussage:</strong></p>
          <p>{statement.text}</p>

          <div>
            <button onClick={() => submitVote('agree')} disabled={submitting}>
              Zustimmung
            </button>
            <button onClick={() => submitVote('neutral')} disabled={submitting}>
              Neutral
            </button>
            <button onClick={() => submitVote('disagree')} disabled={submitting}>
              Ablehnung
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
