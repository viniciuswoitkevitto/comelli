import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layers } from "lucide-react";
import { ProcessedFleetData } from "@/types/fleet";
import { formatNumber } from "@/utils/fleetUtils";

interface GroupChartProps {
  data: ProcessedFleetData[];
}

// Gradient definitions for each group - unique colors
const GROUP_GRADIENTS: Record<string, { id: string; start: string; end: string }> = {
  "FRANGO": { id: "gradientFrango", start: "#22c55e", end: "#16a34a" },
  "SUINO": { id: "gradientSuino", start: "#3b82f6", end: "#1d4ed8" },
  "CONFINAMENTO": { id: "gradientConfinamento", start: "#f97316", end: "#c2410c" },
  "AVES": { id: "gradientAves", start: "#a855f7", end: "#7c3aed" },
  "BOVINO": { id: "gradientBovino", start: "#ec4899", end: "#be185d" },
};

// Fallback colors for additional groups
const FALLBACK_COLORS = [
  { id: "gradient1", start: "#06b6d4", end: "#0891b2" },
  { id: "gradient2", start: "#eab308", end: "#ca8a04" },
  { id: "gradient3", start: "#84cc16", end: "#65a30d" },
  { id: "gradient4", start: "#f43f5e", end: "#e11d48" },
  { id: "gradient5", start: "#6366f1", end: "#4f46e5" },
];

export function GroupChart({ data }: GroupChartProps) {
  const chartData = useMemo(() => {
    // Get all unique groups
    const groups = [...new Set(data.map((d) => d.Grupo))].sort();
    
    // Get all unique months sorted from oldest to most recent (left to right)
    const months = [...new Set(data.map((d) => d.Mês))].sort((a, b) => {
      const [mesA, anoA] = a.split("/");
      const [mesB, anoB] = b.split("/");
      return anoA.localeCompare(anoB) || mesA.localeCompare(mesB);
    });

    // Calculate average for each group per month
    return months.map((mes) => {
      const monthData = data.filter((d) => d.Mês === mes);
      const result: Record<string, string | number> = { mes };

      groups.forEach((grupo) => {
        const groupMonthData = monthData.filter((d) => d.Grupo === grupo);
        if (groupMonthData.length > 0) {
          const avg = groupMonthData.reduce((acc, d) => acc + d.mediaCarregadoNum, 0) / groupMonthData.length;
          result[grupo] = avg;
        }
      });

      return result;
    });
  }, [data]);

  const groups = useMemo(() => [...new Set(data.map((d) => d.Grupo))].sort(), [data]);

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up w-full" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-chart-4/20 flex items-center justify-center">
          <Layers className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Desempenho por Grupo</h3>
          <p className="text-sm text-muted-foreground">Média carregado por grupo ao longo do tempo (km/l)</p>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 20, right: 20 }}>
            <defs>
              {groups.map((grupo, index) => {
                const gradient = GROUP_GRADIENTS[grupo] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                return (
                  <linearGradient key={grupo} id={`gradient-${grupo}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={gradient.start} />
                    <stop offset="100%" stopColor={gradient.end} />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="mes" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(2)}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  // Sort payload by value (highest to lowest)
                  const sortedPayload = [...payload].sort((a, b) => 
                    (b.value as number) - (a.value as number)
                  );
                  return (
                    <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
                      <div className="font-medium mb-2">{label}</div>
                      <div className="space-y-1">
                        {sortedPayload.map((entry, index) => {
                          const gradient = GROUP_GRADIENTS[entry.name as string] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                          return (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span 
                                className="w-3 h-3 rounded-full" 
                                style={{ background: `linear-gradient(90deg, ${gradient.start}, ${gradient.end})` }} 
                              />
                              <span>{entry.name}:</span>
                              <span className="font-bold">{formatNumber(entry.value as number)} km/l</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {groups.map((grupo, index) => {
              const gradient = GROUP_GRADIENTS[grupo] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
              return (
                <Line
                  key={grupo}
                  type="monotone"
                  dataKey={grupo}
                  stroke={`url(#gradient-${grupo})`}
                  strokeWidth={3}
                  dot={{ r: 4, fill: gradient.start }}
                  name={grupo}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
