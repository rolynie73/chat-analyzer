import { cn } from "@/lib/utils";

interface ScoreBarProps {
  label: string;
  value: number;
  description?: string;
  colorOverride?: string;
  className?: string;
}

function getBarColor(value: number) {
  if (value >= 75) return "bg-green-500";
  if (value >= 50) return "bg-yellow-500";
  if (value >= 25) return "bg-orange-500";
  return "bg-red-500";
}

function getTextColor(value: number) {
  if (value >= 75) return "text-green-700";
  if (value >= 50) return "text-yellow-700";
  if (value >= 25) return "text-orange-700";
  return "text-red-700";
}

export default function ScoreBar({ label, value, description, colorOverride, className }: ScoreBarProps) {
  const barColor = colorOverride ?? getBarColor(value);
  const textColor = colorOverride ? "text-gray-700" : getTextColor(value);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={cn("font-bold tabular-nums", textColor)}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
}
