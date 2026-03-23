import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PostJob from './pages/PostJob';
import Apply from './pages/Apply';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'rgba(15, 15, 26, 0.9)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<PostJob />} />
        <Route path="/apply/:link" element={<Apply />} />
        <Route path="/dashboard/:link" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
