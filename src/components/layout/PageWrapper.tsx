import Navbar from './Navbar';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 ${className}`}>
        {children}
      </main>
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-xs text-gray-600">
          TalentLens — AI-powered freelancer matching
        </div>
      </footer>
    </div>
  );
}
