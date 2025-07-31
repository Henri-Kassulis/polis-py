import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Willkommen bei PolisPY</h1>
      <p>Es ist eine abgewandelte variante von https://pol.is </p>
      <Link to="/topics">Zur Themenübersicht</Link>

    </div>
  );
}
