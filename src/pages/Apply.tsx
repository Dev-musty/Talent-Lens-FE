import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import TagInput from '../components/ui/TagInput';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import TierBadge from '../components/ui/TierBadge';
import ScoreBadge from '../components/ui/ScoreBadge';
import { getJob } from '../api/jobs';
import { submitApplication } from '../api/applications';
import type { Job, ApplicationPayload, ApplicationResult } from '../types';

interface FormErrors {
  freelancer_name?: string;
  skills?: string;
  years_experience?: string;
  proposed_rate?: string;
  portfolio_urls?: string;
}

export default function Apply() {
  const { link } = useParams<{ link: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState('');

  const [formData, setFormData] = useState<ApplicationPayload>({
    freelancer_name: '',
    skills: [],
    years_experience: 0,
    portfolio_urls: [],
    bio: '',
    testimonies: '',
    proposed_rate: 0,
    tier: 'junior',
  });
  const [portfolioInputs, setPortfolioInputs] = useState(['']);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showColdStart, setShowColdStart] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);

  useEffect(() => {
    if (!link) return;
    getJob(link)
      .then(setJob)
      .catch((err) => {
        if (err.response?.status === 404) {
          setJobError('This job link is invalid or has expired.');
        } else if (err.code === 'ECONNABORTED') {
          setJobError('Request timed out. The server may be starting up — try again in 30 seconds.');
        } else {
          setJobError('Something went wrong loading this job. Please try again.');
        }
      })
      .finally(() => setJobLoading(false));
  }, [link]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.freelancer_name.trim()) newErrors.freelancer_name = 'Your name is required';
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill';
    if (formData.years_experience < 0 || formData.years_experience > 50) newErrors.years_experience = 'Enter 0-50 years';
    if (!formData.proposed_rate || formData.proposed_rate < 1) newErrors.proposed_rate = 'Rate must be at least $1';

    // validate portfolio URLs
    const validUrls = portfolioInputs.filter((u) => u.trim()).map(u => {
      let url = u.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
      return url;
    });
    for (const url of validUrls) {
      try {
        new URL(url);
      } catch {
        newErrors.portfolio_urls = 'One or more URLs are invalid';
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !link) return;

    const payload: ApplicationPayload = {
      ...formData,
      portfolio_urls: portfolioInputs.filter((u) => u.trim()).map(u => {
        let url = u.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
        return url;
      }),
    };

    setLoading(true);
    setShowColdStart(false);
    const timer = setTimeout(() => setShowColdStart(true), 5000);

    try {
      const data = await submitApplication(link, payload);
      setResult(data);
      if (data.access_granted) {
        toast.success("You're in! Application submitted.");
      }
    } catch (err: unknown) {
      const error = err as { response?: { status: number; data?: { message?: string } }; code?: string };
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. The server may be starting up — try again in 30 seconds.');
      } else if (error.response?.status === 400) {
        toast.error(`Please check your inputs — ${error.response.data?.message || 'validation error'}`);
      } else if (error.response?.status === 404) {
        toast.error('This job link is invalid or has expired.');
      } else {
        toast.error('Something went wrong on our end. Please try again.');
      }
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setShowColdStart(false);
    }
  };

  const addPortfolioInput = () => {
    if (portfolioInputs.length < 3) {
      setPortfolioInputs([...portfolioInputs, '']);
    }
  };

  const updatePortfolio = (index: number, value: string) => {
    const updated = [...portfolioInputs];
    updated[index] = value;
    setPortfolioInputs(updated);
  };

  const removePortfolio = (index: number) => {
    setPortfolioInputs(portfolioInputs.filter((_, i) => i !== index));
  };

  // Loading state
  if (jobLoading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-400">Loading job details...</p>
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (jobError || !job) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center py-24 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Job Not Found</h1>
          <p className="text-gray-400">{jobError || 'This job link is invalid or has expired.'}</p>
        </div>
      </PageWrapper>
    );
  }

  // Result state
  if (result) {
    return (
      <PageWrapper>
        <div className="max-w-lg mx-auto animate-slide-up">
          {result.access_granted ? (
            <div className="glass-card p-6 sm:p-8 border-emerald-500/20">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-1">You're In!</h2>
              <p className="text-gray-400 text-center mb-6">Your application has been accepted.</p>

              <div className="flex items-center justify-center gap-4 mb-6">
                {result.inferred_tier && <TierBadge tier={result.inferred_tier} />}
                {result.fit_score !== undefined && <ScoreBadge score={result.fit_score} label="Fit Score" />}
              </div>

              {result.rank_position !== undefined && result.total_applicants !== undefined && (
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold gradient-text">#{result.rank_position}</span>
                  <span className="text-gray-500 ml-2">of {result.total_applicants} applicants</span>
                </div>
              )}

              {result.ai_reasoning && (
                <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-400">AI Analysis</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{result.ai_reasoning}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 sm:p-8 border-red-500/20">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-red-500/15 ring-1 ring-red-500/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-1">Application Not Accepted</h2>
              <p className="text-gray-400 text-center mb-6">Your profile didn't meet the requirements for this role.</p>

              {result.inferred_tier && (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-sm text-gray-500">Your tier:</span>
                  <TierBadge tier={result.inferred_tier} />
                  <span className="text-sm text-gray-500">→ Required:</span>
                  <TierBadge tier={job.required_tier} />
                </div>
              )}

              {result.rejection_reason && (
                <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                  <p className="text-sm text-gray-300">{result.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto">
        {/* Job info header */}
        <div className="glass-card p-5 sm:p-6 mb-6 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">{job.title}</h1>
              <p className="text-sm text-gray-500 mt-1">by {job.client_name}</p>
            </div>
            <TierBadge tier={job.required_tier} />
          </div>
          <p className="text-gray-400 text-sm mt-4 leading-relaxed">{job.description}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
            <span className="text-sm text-gray-500">
              Budget: <span className="text-white font-medium">${job.budget_min} – ${job.budget_max}</span>
            </span>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 animate-slide-up space-y-5">
          <h2 className="text-lg font-semibold text-white">Apply for this Role</h2>

          <Input
            label="Full Name"
            placeholder="Your full name"
            value={formData.freelancer_name}
            onChange={(e) => setFormData({ ...formData, freelancer_name: (e.target as HTMLInputElement).value })}
            error={errors.freelancer_name}
            required
            disabled={loading}
          />

          <TagInput
            label="Skills"
            tags={formData.skills}
            onChange={(skills) => { setFormData({ ...formData, skills }); if (errors.skills) setErrors({ ...errors, skills: undefined }); }}
            placeholder="e.g. React, TypeScript, Node.js..."
            error={errors.skills}
            required
          />

          <Input
            label="Years of Experience"
            type="number"
            placeholder="3"
            value={formData.years_experience || ''}
            onChange={(e) => setFormData({ ...formData, years_experience: Number((e.target as HTMLInputElement).value) })}
            error={errors.years_experience}
            required
            min={0}
            max={50}
            disabled={loading}
          />

          <Select
            label="Self-assessed Tier"
            options={[
              { value: 'junior', label: 'Junior (1-3 yrs)' },
              { value: 'mid', label: 'Mid (3-6 yrs)' },
              { value: 'senior', label: 'Senior (7+ yrs)' }
            ]}
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
            required
            disabled={loading}
          />

          <Input
            label="Bio"
            placeholder="Brief description of your background and expertise..."
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: (e.target as HTMLTextAreaElement).value })}
            charCount={{ current: formData.bio.length, max: 500 }}
            maxLength={500}
            disabled={loading}
          />

          {/* Portfolio URLs */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Portfolio URLs <span className="text-gray-500">(optional, up to 3)</span></label>
            {portfolioInputs.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updatePortfolio(i, e.target.value)}
                  placeholder="github.com/you"
                  className="input-field flex-1"
                  disabled={loading}
                />
                {portfolioInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePortfolio(i)}
                    className="px-3 text-gray-500 hover:text-red-400 transition-colors"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {portfolioInputs.length < 3 && (
              <button
                type="button"
                onClick={addPortfolioInput}
                className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
                disabled={loading}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add another URL
              </button>
            )}
            {errors.portfolio_urls && <p className="text-sm text-red-400">{errors.portfolio_urls}</p>}
          </div>

          <Input
            label="Client Testimonies"
            placeholder="Paste previous client reviews or references..."
            multiline
            rows={3}
            value={formData.testimonies}
            onChange={(e) => setFormData({ ...formData, testimonies: (e.target as HTMLTextAreaElement).value })}
            disabled={loading}
          />

          <Input
            label="Proposed Rate (USD)"
            type="number"
            placeholder="1200"
            value={formData.proposed_rate || ''}
            onChange={(e) => setFormData({ ...formData, proposed_rate: Number((e.target as HTMLInputElement).value) })}
            error={errors.proposed_rate}
            required
            min={1}
            disabled={loading}
          />

          <div className="pt-2">
            <Button type="submit" loading={loading} loadingText="Analysing your profile..." fullWidth>
              Submit Application
            </Button>
            {showColdStart && (
              <p className="text-sm text-amber-400/80 text-center mt-3 animate-fade-in">
                This may take a moment if the server is waking up...
              </p>
            )}
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
