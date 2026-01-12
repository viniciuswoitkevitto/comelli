import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessedFleetData } from "@/types/fleet";
import { calculateFleetStats, getVehicleRanking, formatNumber, formatKm } from "@/utils/fleetUtils";
import { StatCard } from "./StatCard";
import { Gauge, Route, Truck, Award, AlertTriangle, Layers, Trophy, TrendingDown } from "lucide-react";

interface GroupTabsProps {
  data: ProcessedFleetData[];
}

export function GroupTabs({ data }: GroupTabsProps) {
  const groups = useMemo(() => {
    const uniqueGroups = [...new Set(data.map((d) => d.Grupo))].sort();
    return uniqueGroups;
  }, [data]);

  const groupData = useMemo(() => {
    const result: Record<string, ProcessedFleetData[]> = {};
    groups.forEach((grupo) => {
      result[grupo] = data.filter((d) => d.Grupo === grupo);
    });
    return result;
  }, [data, groups]);

  const groupRankings = useMemo(() => {
    const result: Record<string, { top5: ProcessedFleetData[]; worst5: ProcessedFleetData[] }> = {};
    groups.forEach((grupo) => {
      const ranking = getVehicleRanking(groupData[grupo]);
      result[grupo] = {
        top5: ranking.slice(0, 5),
        worst5: ranking.slice(-5).reverse(),
      };
    });
    return result;
  }, [groups, groupData]);

  if (groups.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-chart-4/20 flex items-center justify-center">
          <Layers className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Métricas por Grupo</h3>
          <p className="text-sm text-muted-foreground">Visualize o desempenho individual de cada grupo</p>
        </div>
      </div>

      <Tabs defaultValue={groups[0]} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-secondary/50 p-2 rounded-xl mb-6">
          {groups.map((grupo) => (
            <TabsTrigger
              key={grupo}
              value={grupo}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2"
            >
              {grupo}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((grupo) => {
          const stats = calculateFleetStats(groupData[grupo]);
          const { top5, worst5 } = groupRankings[grupo];
          const topMax = top5[0]?.mediaCarregadoNum || 1;
          const worstMax = worst5[0]?.mediaCarregadoNum || 1;

          return (
            <TabsContent key={grupo} value={grupo} className="mt-0 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard
                  title="Média Carregado"
                  value={formatNumber(stats.avgMediaCarregado) + " km/l"}
                  subtitle="Média do grupo"
                  icon={Gauge}
                  highlight
                  delay={0}
                />
                <StatCard
                  title="KM Rodado"
                  value={formatKm(stats.totalKmRodado)}
                  subtitle="Total do grupo"
                  icon={Route}
                  delay={50}
                />
                <StatCard
                  title="KM Carregado"
                  value={formatKm(stats.totalKmCarregado)}
                  subtitle="Total carregado"
                  icon={Truck}
                  delay={100}
                />
                <StatCard
                  title="Melhor"
                  value={stats.bestVehicle ? formatNumber(stats.bestVehicle.mediaCarregadoNum) : "-"}
                  subtitle={stats.bestVehicle?.Veículo || "-"}
                  icon={Award}
                  delay={150}
                />
                <StatCard
                  title="Pior"
                  value={stats.worstVehicle ? formatNumber(stats.worstVehicle.mediaCarregadoNum) : "-"}
                  subtitle={stats.worstVehicle?.Veículo || "-"}
                  icon={AlertTriangle}
                  delay={200}
                />
              </div>

              {/* Top 5 and Worst 5 Vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">5 Melhores Veículos</span>
                  </div>
                  <div className="space-y-3">
                    {top5.map((vehicle, index) => {
                      const percentage = (vehicle.mediaCarregadoNum / topMax) * 100;
                      return (
                        <div key={vehicle.Veículo} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs">
                            {index === 0 ? <Trophy className="w-3.5 h-3.5" /> : index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm truncate pr-2">{vehicle.Veículo}</span>
                              <span className="font-bold text-sm text-primary whitespace-nowrap">
                                {formatNumber(vehicle.mediaCarregadoNum)} km/l
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-secondary/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <span className="font-medium text-sm">5 Piores Veículos</span>
                  </div>
                  <div className="space-y-3">
                    {worst5.map((vehicle, index) => {
                      const percentage = (vehicle.mediaCarregadoNum / worstMax) * 100;
                      return (
                        <div key={vehicle.Veículo} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-destructive/20 text-destructive flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm truncate pr-2">{vehicle.Veículo}</span>
                              <span className="font-bold text-sm text-destructive whitespace-nowrap">
                                {formatNumber(vehicle.mediaCarregadoNum)} km/l
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-destructive/60 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
