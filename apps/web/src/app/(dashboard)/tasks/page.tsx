"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tasks } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  gapAnalysis?: {
    control: {
      code: string;
      name: string;
    }
  };
}

export default function TasksPage() {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    setLoading(true);
    tasks.getAll()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (id: string) => {
    try {
        await tasks.update(id, { status: "RESOLVED" });
        fetchTasks(); // Refresh
    } catch (e) {
        console.error("Failed to complete task", e);
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
        case "RESOLVED": return <CheckCircle2 className="h-4 w-4 text-[#2DD4BF]" />;
        case "IN_PROGRESS": return <Clock className="h-4 w-4 text-blue-500" />;
        default: return <Circle className="h-4 w-4 text-slate-300" />;
    }
  };

  // User Request: Only show Active tasks (Hide RESOLVED/CLOSED)
  const activeTasks = data.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');

  if (loading) {
      return <div className="p-12 text-center font-mono text-muted-foreground animate-pulse">GÖREVLER YÜKLENİYOR...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Aksiyon Planları</h1>
          <p className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
            Bekleyen İşlemler & Güvenlik Yamaları
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 border border-border bg-background text-foreground font-mono text-xs font-semibold tracking-wide hover:bg-muted rounded-lg shadow-sm">
                <Filter className="mr-2 h-3.5 w-3.5" /> Filtrele
            </Button>
        </div>
      </div>

      <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-muted/40 border-b border-border">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Görev ID / Açıklama</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Kontrol</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Atanan</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Durum</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide text-right">Oluşturulma</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">İşlem</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {activeTasks.length === 0 && (
                         <tr>
                             <td colSpan={6} className="px-6 py-12 text-center font-mono text-sm text-muted-foreground">
                                 [ SİSTEM GÜVENLİ ] Aktif bir düzeltme görevi bulunamadı.
                             </td>
                         </tr>
                    )}
                    {activeTasks.map((task) => (
                        <tr key={task.id} className="group hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-5">
                                <div className="font-bold font-mono text-sm text-foreground">TASK-{task.id.substring(0,4)}</div>
                                <div className="text-sm font-mono text-muted-foreground mt-0.5 line-clamp-1 group-hover:text-foreground/80">{task.title}</div>
                            </td>
                            <td className="px-6 py-5 font-mono text-xs">
                                {task.gapAnalysis?.control ? (
                                    <span className="text-foreground bg-muted px-2 py-1 rounded-md border border-border/50">
                                        {task.gapAnalysis.control.code}
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </td>
                            <td className="px-6 py-5">
                                {task.assignee ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-muted flex items-center justify-center text-[10px] font-bold font-mono text-foreground border border-border rounded-full">
                                            {task.assignee.name ? task.assignee.name.substring(0,1) : "K"}
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground">{task.assignee.name || task.assignee.email}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-mono text-muted-foreground italic">Atanmadı</span>
                                )}
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(task.status)}
                                    <span className="text-xs font-mono font-bold uppercase tracking-wide text-foreground">{task.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <Button size="sm" variant="outline" className="h-8 text-xs font-mono font-medium uppercase bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg w-full shadow-sm"
                                    onClick={() => handleComplete(task.id)}
                                >
                                    Çözüldü
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
