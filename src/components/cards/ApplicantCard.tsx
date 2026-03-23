import ScoreBadge from '../ui/ScoreBadge';
import TierBadge from '../ui/TierBadge';
import type { Applicant } from '../../types';

interface ApplicantCardProps {
  applicant: Applicant;
  rank: number;
}

export default function ApplicantCard({ applicant, rank }: ApplicantCardProps) {
  return (
    <div className="glass-card-hover p-5 sm:p-6 animate-slide-up" style={{ animationDelay: `${rank * 60}ms` }}>
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 ring-1 ring-brand-500/30 flex items-center justify-center">
          <span className="text-xl font-bold gradient-text">#{rank}</span>
        </div>

        {/* Name + Tier */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-semibold text-white truncate">{applicant.freelancer_name}</h3>
            <TierBadge tier={applicant.inferred_tier} size="sm" />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">${applicant.proposed_rate} USD</p>
        </div>
      </div>

      {/* Scores row */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
        <ScoreBadge score={applicant.fit_score} label="Fit" />
        <ScoreBadge score={applicant.testimony_score} label="Testimony" size="sm" />
        <ScoreBadge score={applicant.price_score} label="Price" size="sm" />
        <div className="ml-auto flex flex-col items-end">
          <span className="text-xs text-gray-500">Overall</span>
          <span className="text-2xl font-bold gradient-text">{applicant.overall_rank_score}</span>
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          <span className="text-xs font-medium text-gray-400">AI Analysis</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{applicant.ai_reasoning}</p>
      </div>

      {/* Portfolio links */}
      {applicant.portfolio_urls && applicant.portfolio_urls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {applicant.portfolio_urls.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-400 bg-brand-500/10 rounded-lg hover:bg-brand-500/20 transition-colors ring-1 ring-brand-500/20"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Portfolio {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
