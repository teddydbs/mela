'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max,
  color = '#FF6B35',
  height = 'h-2',
  className = '',
}: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full transition-all duration-700 ease-out rounded-full"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}DD)`,
        }}
      />
    </div>
  );
}
