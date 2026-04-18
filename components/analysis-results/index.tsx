import type { Orientation } from "@/lib/analyzer/prompts";
import VibesResultView from "./vibes";
import PsychResultView from "./psych";
import ProfessionalResultView from "./professional";
import SocialResultView from "./social";
import RelationalResultView from "./relational";
import StatsResultView from "./stats";

interface AnalysisResultsProps {
  orientation: Orientation;
  result: unknown;
}

export default function AnalysisResults({ orientation, result }: AnalysisResultsProps) {
  switch (orientation) {
    case "vibes":
      return <VibesResultView result={result as Parameters<typeof VibesResultView>[0]["result"]} />;
    case "psych":
      return <PsychResultView result={result as Parameters<typeof PsychResultView>[0]["result"]} />;
    case "professional":
      return <ProfessionalResultView result={result as Parameters<typeof ProfessionalResultView>[0]["result"]} />;
    case "social":
      return <SocialResultView result={result as Parameters<typeof SocialResultView>[0]["result"]} />;
    case "relational":
      return <RelationalResultView result={result as Parameters<typeof RelationalResultView>[0]["result"]} />;
    case "stats":
      return <StatsResultView result={result as Parameters<typeof StatsResultView>[0]["result"]} />;
    default:
      return (
        <pre className="text-xs bg-gray-50 rounded-xl p-4 overflow-auto border border-gray-200">
          {JSON.stringify(result, null, 2)}
        </pre>
      );
  }
}
