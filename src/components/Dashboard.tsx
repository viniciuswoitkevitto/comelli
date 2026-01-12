import { useMemo, useState } from "react";
import { Gauge, Route, Truck, Award, AlertTriangle, RefreshCw, Cloud, Loader2 } from "lucide-react";
import { ProcessedFleetData, FleetData } from "@/types/fleet";
import {
  calculateFleetStats,
  getVehicleRanking,
  getGroupStats,
  getMonthlyTrend,
  getModelStats,
  formatNumber,
  formatKm,
} from "@/utils/fleetUtils";
import { fetchGoogleSheetsData } from "@/utils/dataLoader";
import { StatCard } from "./StatCard";
import { VehicleRanking } from "./VehicleRanking";
import { ModelRanking } from "./ModelRanking";
import { GroupChart } from "./GroupChart";
import { GroupTabs } from "./GroupTabs";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { DataTable } from "./DataTable";

interface DashboardProps {
  data: ProcessedFleetData[];
  onReset: () => void;
  onDataUpdate: (data: FleetData[]) => void;
}

export function Dashboard({ data, onReset, onDataUpdate }: DashboardProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const stats = useMemo(() => calculateFleetStats(data), [data]);
  const vehicleRanking = useMemo(() => getVehicleRanking(data), [data]);
  const modelRanking = useMemo(() => getModelStats(data), [data]);
  const groupStats = useMemo(() => getGroupStats(data), [data]);
  const monthlyTrend = useMemo(() => getMonthlyTrend(data), [data]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              Painel de Desempenho
            </h1>
            <p className="text-muted-foreground mt-1">
              Frota de Carga Viva • {stats.totalVeiculos} veículos • {data.length} registros
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                setIsSyncing(true);
                try {
                  const newData = await fetchGoogleSheetsData();
                  onDataUpdate(newData);
                } catch {
                  alert("Erro ao sincronizar");
                } finally {
                  setIsSyncing(false);
                }
              }}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl font-medium transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
              Atualizar
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl font-medium transition-colors hover:bg-secondary/80"
            >
              <RefreshCw className="w-4 h-4" />
              Novo Arquivo
            </button>
          </div>
        </div>

        {/* Main Metric - Média Carregado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <StatCard
              title="Média Carregado"
              value={formatNumber(stats.avgMediaCarregado) + " km/l"}
              subtitle="Média geral da frota carregada"
              icon={Gauge}
              highlight
              delay={0}
            />
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="KM Total Rodado"
              value={formatKm(stats.totalKmRodado)}
              subtitle="Quilometragem total"
              icon={Route}
              delay={50}
            />
            <StatCard
              title="KM Carregado"
              value={formatKm(stats.totalKmCarregado)}
              subtitle="Quilometragem carregado"
              icon={Truck}
              delay={100}
            />
            <StatCard
              title="Melhor Veículo"
              value={stats.bestVehicle ? formatNumber(stats.bestVehicle.mediaCarregadoNum) : "-"}
              subtitle={stats.bestVehicle?.Veículo || "-"}
              icon={Award}
              delay={150}
            />
            <StatCard
              title="Pior Veículo"
              value={stats.worstVehicle ? formatNumber(stats.worstVehicle.mediaCarregadoNum) : "-"}
              subtitle={stats.worstVehicle?.Veículo || "-"}
              icon={AlertTriangle}
              delay={200}
            />
          </div>
        </div>

        {/* Monthly Trend - Moved up */}
        <div className="mb-6">
          <MonthlyTrendChart data={monthlyTrend} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <VehicleRanking vehicles={vehicleRanking} />
          <GroupChart data={data} />
        </div>

        {/* Group Tabs */}
        <div className="mb-6">
          <GroupTabs data={data} />
        </div>

        {/* Model Ranking */}
        <div className="mb-6">
          <ModelRanking models={modelRanking} />
        </div>

        {/* Data Table - Hidden by default */}
        <DataTable data={data} />
      </div>
    </div>
  );
}
