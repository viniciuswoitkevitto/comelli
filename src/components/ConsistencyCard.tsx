import { Activity, AlertCircle } from "lucide-react";
import { ConsistencyData } from "@/utils/analysisUtils";
import { formatNumber } from "@/utils/fleetUtils";

interface ConsistencyCardProps {
  data: ConsistencyData[];
}

export function ConsistencyCard({ data }: ConsistencyCardProps) {
  const inconsistent = data.filter((d) => d.isInconsistent);

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-chart-4/10">
          <Activity className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Análise de Consistência</h3>
          <p className="text-xs text-muted-foreground">Variação de desempenho por veículo</p>
        </div>
      </div>

      {inconsistent.length > 0 ? (
        <>
          <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-chart-4/10">
            <AlertCircle className="w-4 h-4 text-chart-4" />
            <span className="text-sm text-chart-4 font-medium">
              {inconsistent.length} veículos com alta variação (CV &gt;15%)
            </span>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {inconsistent.slice(0, 10).map((vehicle, idx) => (
              <div
                key={vehicle.veiculo}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-6">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.veiculo}</p>
                    <p className="text-xs text-muted-foreground">
                      Média: {formatNumber(vehicle.media, 2)} km/l
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-chart-4">
                    CV: {formatNumber(vehicle.coeficienteVariacao, 1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    σ: {formatNumber(vehicle.desvioPadrao, 2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Todos os veículos com desempenho consistente!</p>
        </div>
      )}
    </div>
  );
}
