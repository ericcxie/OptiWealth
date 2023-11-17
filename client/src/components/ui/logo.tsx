import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="block" aria-label="Cruip">
      <img src="/dist/assets/logos/logo.png" alt="logo" />
    </Link>
  );
}
