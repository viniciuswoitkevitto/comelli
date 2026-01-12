import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProcessedFleetData } from "@/types/fleet";
import { calculateFleetStats, formatNumber, formatKm } from "@/utils/fleetUtils";
import { StatCard } from "./StatCard";
import { Gauge, Route, Truck, Award, AlertTriangle, Layers } from "lucide-react";

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
          return (
            <TabsContent key={grupo} value={grupo} className="mt-0">
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
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
