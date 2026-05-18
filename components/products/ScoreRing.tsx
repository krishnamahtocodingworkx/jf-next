"use client";

// Circular progress indicator used to render a 0–100 score; color shifts green → blue → amber → red as the value drops.

type ScoreRingProps = {
    value: number;
    size?: number;
};

/** Maps a score to its band color (matches the legend used across cards/detail). */
function getColor(value: number): string {
    if (value >= 85) return "#10B981";
    if (value >= 70) return "#3B82F6";
    if (value >= 50) return "#F59E0B";
    return "#EF4444";
}

export default function ScoreRing({ value, size = 40 }: ScoreRingProps) {
    const safe = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    const radius = (size - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (safe / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor(safe)}
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                {safe}
            </span>
        </div>
    );
}
