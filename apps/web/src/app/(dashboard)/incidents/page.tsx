"use client";

import { useEffect, useState } from "react";
import { Plus, AlertTriangle, CheckCircle2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

import RequirePro from "@/components/auth/require-pro";

export default function IncidentsPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [severity, setSeverity] = useState("MEDIUM");

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await api.get("/incidents");
            setIncidents(res.data);
        } catch (e) {
            console.error("Failed to fetch incidents", e);
        } finally {
            setLoading(false);
        }
    };
    // ... (rest of logic) ... but wrapping return is better? No, if fetchIncidents runs it will error. 
    // I should wrap the return with RequirePro BUT RequirePro renders children only if allowed.
    // So if I wrap the whole return, the useEffect hook still runs.
    
    // BETTER APPROACH: Return RequirePro wrapping the main div.
    // BUT hooks rule... 
    // Wait, the cleanest way is to use a layout or just wrap the content inside the return.
    // If I wrap content inside return, fetchIncidents will still fire on mount.
    // RequirePro does async check.
    
    // OPTION 2: Put RequirePro at top level of page component? No, hooks.
    // OPTION 3: Make IncidentsPageContent and wrap it? Too much refactor.
    
    // OPTION 4: Just let fetch fail (it's already handled with catch) but show Lock screen.
    // RequirePro renders checks first. If I wrap the return JSX, RequirePro will mount.
    // Hooks run. fetchIncidents runs => 403. RequirePro runs checkPlan => false => Shows Lock.
    // This is acceptable safely.


    const handleCreate = async () => {
        if (!title || !desc) return;
        setCreating(true);
        try {
            await api.post("/incidents", {
                title,
                description: desc,
                severity,
            });
            setOpen(false);
            setTitle("");
            setDesc("");
            setSeverity("MEDIUM");
            fetchIncidents();
        } catch (e) {
            console.error(e);
            alert("Olay oluşturulamadı.");
        } finally {
            setCreating(false);
        }
    };

    const handleResolve = async (id: string, currentStatus: string) => {
        if (currentStatus === 'RESOLVED') return;
        const confirm = window.confirm("Bu olayı çözüldü olarak işaretlemek istediğinize emin misiniz?");
        if (!confirm) return;

        try {
            await api.patch(`/incidents/${id}`, { status: 'RESOLVED' });
            fetchIncidents();
        } catch (e) {
            console.error(e);
        }
    };

    return (
      <RequirePro>
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Olay Müdahale Kayıtları</h1>
                    <p className="text-sm text-muted-foreground font-mono">
                        Güvenlik ihlalleri ve olay takibi.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="font-mono text-xs font-semibold tracking-wide">
                                <Plus className="mr-2 h-4 w-4" />
                                YENİ OLAY BİLDİR
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-mono">Güvenlik Olayı Bildir</DialogTitle>
                                <DialogDescription className="font-mono text-xs">
                                    Tespit edilen manuel veya otomatik bir güvenlik ihlalini kaydedin.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="font-mono text-xs">Başlık</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Şüpheli SSH Bağlantısı" className="font-mono" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="severity" className="font-mono text-xs">Önem Derecesi</Label>
                                    <Select value={severity} onValueChange={setSeverity}>
                                        <SelectTrigger className="font-mono text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW" className="font-mono text-xs">LOW (Düşük)</SelectItem>
                                            <SelectItem value="MEDIUM" className="font-mono text-xs">MEDIUM (Orta)</SelectItem>
                                            <SelectItem value="HIGH" className="font-mono text-xs">HIGH (Yüksek)</SelectItem>
                                            <SelectItem value="CRITICAL" className="font-mono text-xs">CRITICAL (Kritik)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="desc" className="font-mono text-xs">Açıklama</Label>
                                    <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Olayın detayları..." className="font-mono text-xs" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreate} disabled={creating} className="font-mono text-xs">
                                    {creating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                                    KAYDET
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 border-b border-border text-xs uppercase font-mono text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 font-semibold tracking-wider">OLAY</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">ÖNEM</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">DURUM</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">KAYNAK</th>
                            <th className="px-6 py-4 font-semibold tracking-wider">TARİH</th>
                            <th className="px-6 py-4 font-semibold tracking-wider text-right">İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {loading ? (
                            <tr><td colSpan={6} className="p-12 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /> Yükleniyor...</td></tr>
                        ) : incidents.length === 0 ? (
                            <tr><td colSpan={6} className="p-12 text-center text-muted-foreground font-mono">Henüz kayıtlı bir olay yok.</td></tr>
                        ) : (
                            incidents.map((incident) => (
                                <tr key={incident.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-foreground">{incident.title}</span>
                                            <span className="text-xs text-muted-foreground font-mono truncate max-w-xs">{incident.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className={`font-mono text-[10px] ${
                                            incident.severity === 'CRITICAL' ? 'border-rose-500 text-rose-500 bg-rose-500/10' :
                                            incident.severity === 'HIGH' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                                            incident.severity === 'MEDIUM' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                                            'border-slate-500 text-slate-500 bg-slate-500/10'
                                        }`}>
                                            {incident.severity}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                         <Badge variant={incident.status === 'RESOLVED' ? 'default' : 'secondary'} className="font-mono text-[10px]">
                                            {incident.status}
                                         </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                        {incident.source}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                        {new Date(incident.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {incident.status !== 'RESOLVED' && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleResolve(incident.id, incident.status)}
                                                className="h-8 text-[10px] font-mono"
                                            >
                                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                                ÇÖZÜLDÜ OLARAK İŞARETLE
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </RequirePro>
    );
}
