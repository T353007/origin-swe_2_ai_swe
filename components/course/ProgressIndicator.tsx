import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressIndicator({
  value,
  label,
  showPercentage = true,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          {showPercentage && <span className="text-muted-foreground">{value}%</span>}
        </div>
      )}
      <Progress value={value} className="h-2" />
    </div>
  );
}

