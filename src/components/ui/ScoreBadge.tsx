interface ScoreBadgeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md';
}

export default function ScoreBadge({ score, label, size = 'md' }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 80) return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/30' };
    if (score >= 60) return { bg: 'bg-amber-500/15', text: 'text-amber-400', ring: 'ring-amber-500/30' };
    return { bg: 'bg-red-500/15', text: 'text-red-400', ring: 'ring-red-500/30' };
  };

  const colors = getColor();
  const isSmall = size === 'sm';

  return (
    <div className={`flex flex-col items-center gap-0.5 ${isSmall ? 'min-w-[48px]' : 'min-w-[64px]'}`}>
      <div
        className={`${colors.bg} ${colors.text} ring-1 ${colors.ring} rounded-xl font-bold flex items-center justify-center
          ${isSmall ? 'w-10 h-10 text-xs' : 'w-14 h-14 text-base'}`}
      >
        {score}
      </div>
      <span className={`text-gray-500 font-medium ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
        {label}
      </span>
    </div>
  );
}
