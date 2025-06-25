import { TrendingUp } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <TrendingUp className="size-5" />
      </div>
      <h1 className="text-xl font-bold text-foreground">
        METAYield
      </h1>
    </div>
  );
}
