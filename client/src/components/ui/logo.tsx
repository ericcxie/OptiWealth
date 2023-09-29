import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="block" aria-label="Cruip">
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            cx="21.152%"
            cy="86.063%"
            fx="21.152%"
            fy="86.063%"
            r="79.941%"
            id="footer-logo"
          >
            <stop stopColor="#a237c3" offset="0%" />
            <stop stopColor="#76316A" offset="25.871%" />
            <stop stopColor="#1D2671" offset="100%" />
          </radialGradient>
        </defs>
        <rect
          width="32"
          height="32"
          rx="16"
          fill="url(#footer-logo)"
          fillRule="nonzero"
        />
      </svg>
    </Link>
  );
}
