interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md';
}

export default function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const getStyle = () => {
    switch (tier.toLowerCase()) {
      case 'senior':
        return 'bg-amber-500/15 text-amber-400 ring-amber-500/30';
      case 'mid':
        return 'bg-blue-500/15 text-blue-400 ring-blue-500/30';
      case 'junior':
      default:
        return 'bg-gray-500/15 text-gray-400 ring-gray-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center ring-1 rounded-full font-semibold capitalize
        ${getStyle()}
        ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      {tier}
    </span>
  );
}
