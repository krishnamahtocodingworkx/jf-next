import type {
    PackageItem,
    PackagingProduct,
    PackagingSustainabilityChartPoint,
    SustainabilityPoint,
} from "@/utils/model";

export function getScoreBadgeClassName(score: number): string {
    if (score >= 85) return "bg-emerald-100 text-emerald-700";
    if (score >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
}

export function getScoreBarClassName(score: number): string {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
}

export function getPackagingTagPillClassName(tag: PackageItem["tag"]): string {
    switch (tag) {
        case "Retail":
            return "bg-blue-50 text-blue-700 border-blue-200";
        case "Food Service":
            return "bg-orange-50 text-orange-700 border-orange-200";
        case "E-Commerce":
            return "bg-purple-50 text-purple-700 border-purple-200";
        default:
            return "bg-slate-100 text-slate-600 border-slate-200";
    }
}

export function getCostVarianceTextClassName(costVariance: string): string {
    return costVariance.startsWith("+") ? "text-red-600" : "text-emerald-600";
}

export function filterProductsByAssociatedIds(
    products: PackagingProduct[],
    associatedProductIds: string[]
): PackagingProduct[] {
    return products.filter((p) => associatedProductIds.includes(p.id));
}

export function buildSustainabilityChartPoints(
    points: SustainabilityPoint[],
    max: number,
    width: number,
    height: number
): PackagingSustainabilityChartPoint[] {
    const h = height;
    const w = width;
    return points.map((p, i) => {
        const x = (i / (points.length - 1)) * (w - 20) + 10;
        const y = h - 10 - (p.value / max) * (h - 20);
        return { x, y, month: p.month, value: p.value };
    });
}

export function buildLineAndAreaPaths(
    pts: Pick<PackagingSustainabilityChartPoint, "x" | "y">[],
    canvasHeight: number
): { linePath: string; areaPath: string } {
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${canvasHeight} L ${pts[0].x} ${canvasHeight} Z`;
    return { linePath, areaPath };
}

export function gridLineY(value: number, max: number, height: number): number {
    const h = height;
    return h - 10 - (value / max) * (h - 20);
}
