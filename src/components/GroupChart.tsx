import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Layers } from "lucide-react";

interface GroupChartProps {
  data: { grupo: string; kmTotal: number; mediaCarregado: number }[];
}

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(217, 91%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 67%, 60%)",
  "hsl(340, 75%, 55%)",
];

export function GroupChart({ data }: GroupChartProps) {
  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-chart-4/20 flex items-center justify-center">
          <Layers className="w-5 h-5 text-chart-4" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Desempenho por Grupo</h3>
          <p className="text-sm text-muted-foreground">Média carregado por grupo (km/l)</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="grupo"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [value.toFixed(2) + " km/l", "Média Carregado"]}
            />
            <Bar dataKey="mediaCarregado" radius={[0, 8, 8, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
