interface HealthScoreProps {
  score: number; // 0-100
  size?: 'sm' | 'md';
}

export default function HealthScore({ score, size = 'md' }: HealthScoreProps) {
  const getHealthInfo = (value: number) => {
    if (value >= 80) {
      return {
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        label: 'Excellent',
        emoji: '🟢',
      };
    }
    if (value >= 60) {
      return {
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        label: 'Good',
        emoji: '🔵',
      };
    }
    if (value >= 40) {
      return {
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        label: 'Fair',
        emoji: '🟡',
      };
    }
    return {
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      label: 'Poor',
      emoji: '🔴',
    };
  };

  const { color, bgColor, borderColor, label, emoji } = getHealthInfo(score);
  const isSmall = size === 'sm';

  return (
    <div className={`flex items-center gap-2 ${isSmall ? 'text-sm' : 'text-base'}`}>
      <div
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg border
          ${bgColor} ${borderColor}
        `}
      >
        <span className={isSmall ? 'text-base' : 'text-lg'}>{emoji}</span>
        <span className={`font-bold ${color}`}>{score.toFixed(0)}</span>
        <span className="text-gray-400">/100</span>
      </div>
      <span className={`${color} font-medium`}>{label}</span>
    </div>
  );
}
