import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageWrapper from '../components/layout/PageWrapper';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import ApplicantCard from '../components/cards/ApplicantCard';
import { getJob } from '../api/jobs';
import { getApplications } from '../api/applications';
import type { Job, Applicant, FilterParams } from '../types';

const TIER_FILTER_OPTIONS = [
  { value: '', label: 'All Tiers' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
];

const SORT_OPTIONS = [
  { value: 'rank', label: 'Overall Rank' },
  { value: 'price', label: 'Price Score' },
  { value: 'testimony', label: 'Testimony Score' },
];

export default function Dashboard() {
  const { link } = useParams<{ link: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [tierFilter, setTierFilter] = useState('');
  const [sortBy, setSortBy] = useState('rank');

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!link) return;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params: FilterParams = {};
      if (tierFilter) params.tier = tierFilter as FilterParams['tier'];
      if (sortBy !== 'rank') params.sort = sortBy as FilterParams['sort'];

      const [jobData, appsData] = await Promise.all([
        !job ? getJob(link) : Promise.resolve(job),
        getApplications(link, params),
      ]);

      setJob(jobData);
      setApplicants(appsData);
      if (isRefresh) toast.success('Dashboard refreshed!');
    } catch (err: unknown) {
      const error = err as { response?: { status: number }; code?: string };
      if (error.response?.status === 404) {
        setError('This job link is invalid or has expired.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. The server may be starting up — try again in 30 seconds.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [link, tierFilter, sortBy, job]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyApplyLink = () => {
    const applyUrl = `${window.location.origin}/apply/${link}`;
    navigator.clipboard.writeText(applyUrl);
    toast.success('Apply link copied to clipboard!');
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error || !job) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center py-24 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Dashboard Not Found</h1>
          <p className="text-gray-400">{error || 'This dashboard link is invalid or has expired.'}</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{job.title}</h1>
        <p className="text-gray-500">by {job.client_name}</p>
        <div className="flex items-center gap-4 mt-3">
          <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-sm font-medium ring-1 ring-brand-500/20">
            {applicants.length} admitted
          </span>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-6 animate-slide-up">
        <Select
          label="Filter by Tier"
          options={TIER_FILTER_OPTIONS}
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="flex-1"
        />
        <Select
          label="Sort by"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-1"
        />
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="btn-secondary flex items-center justify-center gap-2 h-[46px] sm:px-5"
          id="refresh-dashboard"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Applicant list */}
      {applicants.length === 0 ? (
        <div className="glass-card p-8 text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-brand-500/10 ring-1 ring-brand-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">No applications yet</h2>
          <p className="text-gray-400 mb-5">Share your apply link to start receiving candidates.</p>
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <code className="flex-1 text-sm text-brand-400 bg-brand-500/10 rounded-lg px-3 py-2 truncate">
              {window.location.origin}/apply/{link}
            </code>
            <button
              onClick={copyApplyLink}
              className="flex-shrink-0 p-2.5 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
              id="copy-apply-link-dashboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant, index) => (
            <ApplicantCard key={applicant.id} applicant={applicant} rank={index + 1} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
