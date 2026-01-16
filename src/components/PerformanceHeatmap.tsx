import { Grid3X3 } from "lucide-react";
import { HeatmapData } from "@/utils/analysisUtils";
import { formatNumber } from "@/utils/fleetUtils";
import { cn } from "@/lib/utils";

interface PerformanceHeatmapProps {
  data: HeatmapData[];
  meses: string[];
}

export function PerformanceHeatmap({ data, meses }: PerformanceHeatmapProps) {
  // Limit to last 6 months for better visualization
  const recentMeses = meses.slice(-6);
  
  // Only show vehicles with data in recent months
  const filteredData = data
    .map((v) => ({
      ...v,
      meses: v.meses.filter((m) => recentMeses.includes(m.mes)),
    }))
    .filter((v) => v.meses.some((m) => m.valor > 0))
    .slice(0, 20); // Limit to 20 vehicles

  const getColor = (performance: "good" | "medium" | "bad", valor: number) => {
    if (valor === 0) return "bg-muted/30";
    switch (performance) {
      case "good":
        return "bg-accent/70";
      case "bad":
        return "bg-destructive/70";
      default:
        return "bg-warning/50";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-chart-5/10">
          <Grid3X3 className="w-5 h-5 text-chart-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Mapa de Calor</h3>
          <p className="text-xs text-muted-foreground">Performance por veículo/mês</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-accent/70"></span> Bom
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-warning/50"></span> Médio
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-destructive/70"></span> Ruim
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2 font-medium text-muted-foreground sticky left-0 bg-card">
                Veículo
              </th>
              {recentMeses.map((mes) => (
                <th key={mes} className="text-center p-2 font-medium text-muted-foreground min-w-[60px]">
                  {mes}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((vehicle) => (
              <tr key={vehicle.veiculo} className="hover:bg-muted/30">
                <td className="p-2 font-medium text-foreground sticky left-0 bg-card whitespace-nowrap">
                  {vehicle.veiculo}
                </td>
                {recentMeses.map((mes) => {
                  const mesData = vehicle.meses.find((m) => m.mes === mes);
                  return (
                    <td key={mes} className="p-1">
                      <div
                        className={cn(
                          "w-full h-8 rounded flex items-center justify-center text-xs font-medium transition-colors",
                          mesData ? getColor(mesData.performance, mesData.valor) : "bg-muted/30",
                          mesData?.valor && mesData.valor > 0 ? "text-white" : "text-muted-foreground"
                        )}
                        title={mesData ? `${formatNumber(mesData.valor, 2)} km/l` : "Sem dados"}
                      >
                        {mesData && mesData.valor > 0 ? formatNumber(mesData.valor, 1) : "-"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Grid3X3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Sem dados suficientes para o heatmap</p>
        </div>
      )}
    </div>
  );
}
