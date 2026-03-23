import { useState } from 'react';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { createJob } from '../api/jobs';
import type { CreateJobPayload } from '../types';

const TIER_OPTIONS = [
  { value: 'any', label: 'Any Tier' },
  { value: 'junior', label: 'Junior Only' },
  { value: 'mid', label: 'Mid and Above' },
  { value: 'senior', label: 'Senior Only' },
];

interface FormErrors {
  title?: string;
  description?: string;
  budget_min?: string;
  budget_max?: string;
  client_name?: string;
}

export default function PostJob() {
  const [formData, setFormData] = useState<CreateJobPayload>({
    title: '',
    description: '',
    budget_min: 0,
    budget_max: 0,
    required_tier: 'any',
    client_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<{ apply_url: string; dashboard_url: string } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    else if (formData.title.length > 100) newErrors.title = 'Job title must be under 100 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters';
    else if (formData.description.length > 2000) newErrors.description = 'Description must be under 2000 characters';

    if (!formData.budget_min || formData.budget_min < 1) newErrors.budget_min = 'Minimum budget must be at least $1';
    if (!formData.budget_max || formData.budget_max < 1) newErrors.budget_max = 'Maximum budget must be at least $1';
    else if (formData.budget_max < formData.budget_min) newErrors.budget_max = 'Maximum budget must be ≥ minimum';

    if (!formData.client_name.trim()) newErrors.client_name = 'Your name or company is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await createJob(formData);
      const baseUrl = window.location.origin;
      setResult({
        apply_url: `${baseUrl}${data.apply_url}`,
        dashboard_url: `${baseUrl}${data.dashboard_url}`,
      });
      toast.success('Job created! Your links are ready.');
    } catch (err: unknown) {
      const error = err as { response?: { status: number; data?: { message?: string } }; code?: string };
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. The server may be starting up — try again in 30 seconds.');
      } else if (error.response?.status === 400) {
        toast.error(`Please check your inputs — ${error.response.data?.message || 'validation error'}`);
      } else if (error.response?.status === 500) {
        toast.error('Something went wrong on our end. Please try again.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const updateField = (field: keyof CreateJobPayload, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (result) {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto animate-slide-up">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">Job Created Successfully!</h1>
          <p className="text-gray-400 text-center mb-8">
            Share the apply link with freelancers. Open your dashboard to see ranked applications.
          </p>

          {/* Apply Link */}
          <div className="glass-card p-5 mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Apply Link — share with freelancers</label>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 text-sm text-brand-400 bg-brand-500/10 rounded-lg px-3 py-2 truncate">
                {result.apply_url}
              </code>
              <button
                onClick={() => copyToClipboard(result.apply_url, 'Apply link')}
                className="flex-shrink-0 p-2.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
                id="copy-apply-link"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dashboard Link */}
          <div className="glass-card p-5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dashboard Link — bookmark this</label>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 text-sm text-purple-400 bg-purple-500/10 rounded-lg px-3 py-2 truncate">
                {result.dashboard_url}
              </code>
              <button
                onClick={() => copyToClipboard(result.dashboard_url, 'Dashboard link')}
                className="flex-shrink-0 p-2.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                id="copy-dashboard-link"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
              </button>
            </div>
          </div>

          <Button
            variant="secondary"
            fullWidth
            className="mt-6"
            onClick={() => { setResult(null); setFormData({ title: '', description: '', budget_min: 0, budget_max: 0, required_tier: 'any', client_name: '' }); }}
          >
            Post Another Job
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Find Your Perfect <span className="gradient-text">Freelancer</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Post a role and let AI rank applicants by skill, experience, and fit.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 animate-slide-up space-y-5">
          <Input
            label="Job Title"
            placeholder="e.g. React Developer for fintech app"
            value={formData.title}
            onChange={(e) => updateField('title', (e.target as HTMLInputElement).value)}
            error={errors.title}
            required
            maxLength={100}
          />

          <Input
            label="Job Description"
            placeholder="Describe the role, responsibilities, and ideal candidate..."
            multiline
            rows={5}
            value={formData.description}
            onChange={(e) => updateField('description', (e.target as HTMLTextAreaElement).value)}
            error={errors.description}
            required
            charCount={{ current: formData.description.length, max: 2000 }}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget Min ($)"
              type="number"
              placeholder="500"
              value={formData.budget_min || ''}
              onChange={(e) => updateField('budget_min', Number((e.target as HTMLInputElement).value))}
              error={errors.budget_min}
              required
              min={1}
            />
            <Input
              label="Budget Max ($)"
              type="number"
              placeholder="1500"
              value={formData.budget_max || ''}
              onChange={(e) => updateField('budget_max', Number((e.target as HTMLInputElement).value))}
              error={errors.budget_max}
              required
              min={1}
            />
          </div>

          <Select
            label="Required Tier"
            options={TIER_OPTIONS}
            value={formData.required_tier}
            onChange={(e) => updateField('required_tier', e.target.value)}
            required
          />

          <Input
            label="Your Name / Company"
            placeholder="e.g. Acme Inc"
            value={formData.client_name}
            onChange={(e) => updateField('client_name', (e.target as HTMLInputElement).value)}
            error={errors.client_name}
            required
          />

          <Button type="submit" loading={loading} loadingText="Creating job..." fullWidth className="mt-2">
            Create Job Posting
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
}
