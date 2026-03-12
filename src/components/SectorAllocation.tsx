import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieIcon } from 'lucide-react';
import { PortfolioAnalysis } from '@/types/portfolio';

interface SectorAllocationProps {
  analysis: PortfolioAnalysis;
}

const COLORS = [
  'hsl(160, 55%, 40%)', 'hsl(210, 70%, 50%)', 'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(340, 80%, 55%)',
  'hsl(170, 50%, 45%)', 'hsl(45, 70%, 50%)', 'hsl(200, 60%, 45%)',
  'hsl(120, 40%, 45%)', 'hsl(260, 50%, 55%)', 'hsl(30, 60%, 50%)', 'hsl(220, 10%, 50%)',
];

export const SectorAllocation = ({ analysis }: SectorAllocationProps) => {
  const data = Object.entries(analysis.sectorExposure)
    .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="section-header text-base sm:text-lg">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <PieIcon className="h-4 w-4 text-primary" />
          </div>
          Sector Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Add holdings to see allocation</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val.toFixed(1)}%`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {data.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-foreground w-12 text-right">{item.value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
