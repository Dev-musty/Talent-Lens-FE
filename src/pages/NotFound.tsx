import { Link } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <div className="w-20 h-20 mb-6 rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
          <span className="text-4xl font-bold gradient-text">404</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to="/" className="btn-primary">
          ← Back to Home
        </Link>
      </div>
    </PageWrapper>
  );
}
