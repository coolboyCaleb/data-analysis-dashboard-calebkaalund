import { TrendingUp, AlertTriangle, BarChart3, Info, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataInsight, DataRow } from "@/types/data";
import { Button } from "./ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsPanelProps {
	data: DataRow[];
	insights: DataInsight[];
	showAll?: boolean;
}

const InsightsPanel = ({
	data,
	insights,
	showAll: initialShowAll = false,
}: InsightsPanelProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showAll, setShowAll] = useState(initialShowAll);
	const [aiInsight, setAiInsight] = useState<{
		summary: string;
		anomalies: string[];
	}>();

	const getInsightIcon = (type: DataInsight["type"]) => {
		switch (type) {
			case "trend":
				return <TrendingUp className="h-4 w-4" />;
			case "outlier":
				return <AlertTriangle className="h-4 w-4" />;
			case "correlation":
				return <BarChart3 className="h-4 w-4" />;
			default:
				return <Info className="h-4 w-4" />;
		}
	};

	const getInsightColor = (type: DataInsight["type"]) => {
		switch (type) {
			case "trend":
				return "bg-green-100 text-green-800";
			case "outlier":
				return "bg-yellow-100 text-yellow-800";
			case "correlation":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleGenerateInsight = async () => {
		setIsLoading(true);
		
		// Mock API call simulation
		try {
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			const mockResponse = {
				summary: "This dataset shows a strong positive correlation between the primary variables. The distribution is slightly skewed to the right, indicating a few high-value outliers that might be driving the average up.",
				anomalies: [
					"Detected 3 potential outliers in the upper quartile range.",
					"Unusual spike in values observed in the recent data points.",
					"Consistent pattern deviation found in the second quarter data."
				]
			};
			
			setAiInsight(mockResponse);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const displayedInsights = showAll ? insights : insights.slice(0, 4);

	if (insights.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Insights</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-gray-500 text-center py-8">
						No insights available. Upload data to see automated analysis.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-xl">
					<TrendingUp className="h-5 w-5 text-blue-600" />
					Data Insights
					<Badge variant="secondary" className="ml-2">
						{insights.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-6">
					<Button 
						onClick={handleGenerateInsight} 
						disabled={isLoading} 
						className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating AI Analysis...
							</>
						) : (
							"Generate AI Analysis"
						)}
					</Button>
				</div>

				{isLoading && !aiInsight && (
					<div className="space-y-3 mb-6">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
					</div>
				)}

				{aiInsight && (
					<div className="mb-6 border border-indigo-100 bg-indigo-50/50 rounded-lg p-5 animate-in fade-in slide-in-from-top-2">
						<h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
							<BotIcon className="h-4 w-4" />
							AI Summary
						</h4>
						<p className="text-sm text-gray-700 mb-3 leading-relaxed">
							{aiInsight.summary}
						</p>
						{aiInsight.anomalies && aiInsight.anomalies.length > 0 && (
							<div className="bg-white/60 rounded p-3">
								<p className="text-xs font-semibold text-indigo-800 mb-2 uppercase tracking-wide">Key Observations</p>
								<ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
									{aiInsight.anomalies.map((anomaly, idx) => (
										<li key={idx}>{anomaly}</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}

				<div className="space-y-4">
					{displayedInsights.map((insight, index) => (
						<div
							key={index}
							className="border rounded-lg p-4 hover:bg-slate-50 transition-all duration-200 group"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-start gap-3 flex-1">
									<div
										className={`p-2 rounded-full shrink-0 ${getInsightColor(insight.type)}`}
									>
										{getInsightIcon(insight.type)}
									</div>
									<div className="flex-1">
										<h4 className="font-medium text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
											{insight.title}
										</h4>
										<p className="text-sm text-gray-600 mb-2 leading-relaxed">
											{insight.description}
										</p>

										{insight.value && (
											<Badge variant="secondary" className="text-xs font-mono">
												{insight.value}
											</Badge>
										)}
									</div>
								</div>

								{insight.confidence && (
									<Badge variant="outline" className={`text-xs ${
										insight.confidence === 'high' ? 'border-green-200 text-green-700 bg-green-50' : 
										insight.confidence === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
										'text-gray-500'
									}`}>
										{insight.confidence.charAt(0).toUpperCase() + insight.confidence.slice(1)} confidence
									</Badge>
								)}
							</div>
						</div>
					))}

					{insights.length > 4 && (
						<div className="text-center pt-2">
							<Button
								variant="ghost"
								onClick={() => setShowAll(!showAll)}
								className="text-gray-500 hover:text-gray-900"
							>
								{showAll ? (
									<>
										Show Less <ChevronUp className="ml-2 h-4 w-4" />
									</>
								) : (
									<>
										Show {insights.length - 4} More <ChevronDown className="ml-2 h-4 w-4" />
									</>
								)}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

function BotIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 8V4H8" />
			<rect width="16" height="12" x="4" y="8" rx="2" />
			<path d="M2 14h2" />
			<path d="M20 14h2" />
			<path d="M15 13v2" />
			<path d="M9 13v2" />
		</svg>
	)
}

export default InsightsPanel;
