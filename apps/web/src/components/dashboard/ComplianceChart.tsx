"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ComplianceStats {
  standard: string;
  score: number;
  passed: number;
  total: number;
}

interface ComplianceChartProps {
  data: ComplianceStats[];
}

export function ComplianceChart({ data }: ComplianceChartProps) {
  // Sort data by score (optional)
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return (
    <Card className="bg-card border-border shadow-sm col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-mono">Uyumluluk Analizi (Standart Bazlı)</CardTitle>
        <CardDescription className="text-xs">
          ISO 27001, SOC 2 ve KVKK uyumluluk puanları (Son tarama baz alınmıştır).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-mono">
              Veri bulunamadı. Lütfen yeni bir tarama başlatın.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                    dataKey="standard" 
                    type="category" 
                    width={100} 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                            <div className="bg-popover border border-border p-2 rounded-lg shadow-lg">
                                <p className="text-sm font-bold text-popover-foreground">{d.standard}</p>
                                <p className="text-xs text-muted-foreground">{d.score}% Score</p>
                                <p className="text-xs text-muted-foreground">{d.passed}/{d.total} Controls</p>
                            </div>
                        );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20} background={{ fill: '#f1f5f9' }}>
                    {sortedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 90 ? '#10b981' : entry.score >= 70 ? '#f59e0b' : '#ef4444'} />
                    ))}
                </Bar>
                <ReferenceLine x={70} stroke="#f59e0b" strokeDasharray="3 3" />
                <ReferenceLine x={90} stroke="#10b981" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
