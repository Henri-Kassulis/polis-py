import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function ResultsPage() {
  const { topicId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`http://localhost:8000/api/votes/${topicId}/results/`);
        if (!res.ok) throw new Error("Fehler beim Laden der Ergebnisse");
        const data = await res.json();
        setResults(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [topicId]);

  if (loading) return <p>Lade Ergebnisse...</p>;
  if (error) return <p>Fehler: {error}</p>;

  const maxVotes = Math.max(
     results.map(result => Math.max(result.agree, result.neutral, result.disagree))
  );


  return (
    <div>
      <h2>Abstimmungsergebnisse</h2>

      {/* Tabelle */}
      <table>
        <thead>
          <tr>
            <th>Aussage</th>
            <th>Zustimmung</th>
            <th>Neutral</th>
            <th>Ablehnung</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.statement_id}>
              <td>{r.statement_text}</td>
              <td>{r.agree}</td>
              <td>{r.neutral}</td>
              <td>{r.disagree}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Balkendiagramm */}
      <h3>Visualisierung</h3>
        <ResponsiveContainer width="100%" height={results.length * 60}>
        <BarChart
            layout="vertical"
            data={results}
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number"  domain={[0, maxVotes ]}/>
            <YAxis dataKey="statement_text" type="category" width={250} />
            <Tooltip />
            <Legend />
            <Bar dataKey="agree" stackId="a" fill="#4caf50" name="Zustimmung" />
            <Bar dataKey="neutral" stackId="a" fill="#ffeb3b" name="Neutral" />
            <Bar dataKey="disagree" stackId="a" fill="#f44336" name="Ablehnung" />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
