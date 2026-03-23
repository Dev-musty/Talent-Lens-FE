import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f1a]/80 border-b border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">
            Talent<span className="gradient-text">Lens</span>
          </span>
        </Link>

        {!isHome && (
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Post a Job
          </Link>
        )}
      </div>
    </nav>
  );
}
