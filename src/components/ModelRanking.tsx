import { Trophy, Car } from "lucide-react";
import { formatNumber } from "@/utils/fleetUtils";

interface ModelStats {
  modelo: string;
  marca: string;
  mediaCarregado: number;
  count: number;
}

interface ModelRankingProps {
  models: ModelStats[];
}

export function ModelRanking({ models }: ModelRankingProps) {
  const topModels = models.slice(0, 10);
  const maxMedia = topModels[0]?.mediaCarregado || 1;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-xl">
          <Car className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Melhores Modelos</h3>
          <p className="text-sm text-muted-foreground">Por Média Carregado</p>
        </div>
      </div>

      <div className="space-y-3">
        {topModels.map((model, index) => {
          const percentage = (model.mediaCarregado / maxMedia) * 100;
          const isTop3 = index < 3;

          return (
            <div
              key={model.modelo}
              className="relative group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isTop3
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index === 0 ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className="font-medium text-sm truncate pr-2"
                      title={model.modelo}
                    >
                      {model.modelo}
                    </span>
                    <span className="font-bold text-sm text-primary whitespace-nowrap">
                      {formatNumber(model.mediaCarregado)} km/l
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTop3 ? "bg-accent" : "bg-primary/60"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {model.count} reg.
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {model.marca}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
