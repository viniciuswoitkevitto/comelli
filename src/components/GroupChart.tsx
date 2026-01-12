import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layers } from "lucide-react";
import { ProcessedFleetData } from "@/types/fleet";
import { formatNumber } from "@/utils/fleetUtils";

interface GroupChartProps {
  data: ProcessedFleetData[];
}

const COLORS: Record<string, string> = {
  "FRANGO": "#22c55e",
  "SUINO": "#3b82f6",
  "CONFINAMENTO": "#f97316",
  "AVES": "#a855f7",
  "BOVINO": "#ec4899",
};

export function GroupChart({ data }: GroupChartProps) {
  const chartData = useMemo(() => {
    // Get all unique groups
    const groups = [...new Set(data.map((d) => d.Grupo))].sort();
    
    // Get all unique months sorted from most recent to oldest
    const months = [...new Set(data.map((d) => d.Mês))].sort((a, b) => {
      const [mesA, anoA] = a.split("/");
      const [mesB, anoB] = b.split("/");
      return anoB.localeCompare(anoA) || mesB.localeCompare(mesA);
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
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-chart-4/20 flex items-center justify-center">
          <Layers className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Desempenho por Grupo</h3>
          <p className="text-sm text-muted-foreground">Média carregado por grupo ao longo do tempo (km/l)</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 20, right: 20 }}>
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
              formatter={(value: number, name: string) => [formatNumber(value) + " km/l", name]}
            />
            <Legend />
            {groups.map((grupo, index) => (
              <Line
                key={grupo}
                type="monotone"
                dataKey={grupo}
                stroke={COLORS[grupo] || `hsl(${index * 60}, 70%, 50%)`}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={grupo}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
