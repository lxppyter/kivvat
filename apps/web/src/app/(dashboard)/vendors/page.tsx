"use client";

import { useEffect, useState } from "react";
import { Plus, Check, X, Shield, Briefcase, FileText, Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Checkbox } from "@/components/ui/checkbox";
import { vendors } from "@/lib/api";
import RequirePro from "@/components/auth/require-pro";

export default function VendorsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [riskScore, setRiskScore] = useState("LOW");
    const [hasIso27001, setHasIso27001] = useState(false);
    const [hasSoc2, setHasSoc2] = useState(false);
    const [hasGdpr, setHasGdpr] = useState(false);

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await vendors.getAll();
            setData(res.data);
        } catch (e) {
            console.error("Failed to fetch vendors", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!name) return;
        setCreating(true);
        try {
            await vendors.create({
                name,
                contactName: contactName || undefined,
                email: email || undefined,
                riskScore,
                hasIso27001,
                hasSoc2,
                hasGdpr
            });
            setOpen(false);
            resetForm();
            fetchVendors();
        } catch (e) {
            console.error(e);
            alert("Tedarikçi oluşturulamadı.");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Bu tedarikçiyi silmek istediğinize emin misiniz?")) return;
        try {
            await vendors.remove(id);
            fetchVendors();
        } catch(e) {
            console.error(e);
            alert("Silme işlemi başarısız.");
        }
    };

    const resetForm = () => {
        setName("");
        setContactName("");
        setEmail("");
        setRiskScore("LOW");
        setHasIso27001(false);
        setHasSoc2(false);
        setHasGdpr(false);
    };

    return (
        <RequirePro>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Tedarikçi Risk Yönetimi</h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            3. parti yazılım ve hizmet sağlayıcıların güvenlik takibi.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button className="font-mono text-xs font-semibold tracking-wide gap-2">
                                    <Plus className="h-4 w-4" />
                                    TEDARİKÇİ EKLE
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="font-mono">Yeni Tedarikçi Ekle</DialogTitle>
                                    <DialogDescription className="font-mono text-xs">
                                        Tedarikçinin risk seviyesini ve sertifikasyonlarını belirtin.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="font-mono text-xs">Tedarikçi Adı</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: AWS, Slack, GitHub" className="font-mono" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="contact" className="font-mono text-xs">İlgili Kişi</Label>
                                            <Input id="contact" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Opsiyonel" className="font-mono" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="font-mono text-xs">E-posta</Label>
                                            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@vendor.com" className="font-mono" />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="risk" className="font-mono text-xs">Risk Skoru</Label>
                                        <Select value={riskScore} onValueChange={setRiskScore}>
                                            <SelectTrigger className="font-mono text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW" className="font-mono text-xs text-emerald-600">LOW (Düşük)</SelectItem>
                                                <SelectItem value="MEDIUM" className="font-mono text-xs text-amber-600">MEDIUM (Orta)</SelectItem>
                                                <SelectItem value="HIGH" className="font-mono text-xs text-orange-600">HIGH (Yüksek)</SelectItem>
                                                <SelectItem value="CRITICAL" className="font-mono text-xs text-rose-600">CRITICAL (Kritik)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-3 pt-2">
                                        <Label className="font-mono text-xs">Sertifikasyonlar</Label>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center space-x-2 border border-border/50 p-2 rounded-md">
                                                <Checkbox id="iso" checked={hasIso27001} onCheckedChange={(c) => setHasIso27001(!!c)} />
                                                <label htmlFor="iso" className="text-xs font-mono font-medium leading-none cursor-pointer flex-1">
                                                    ISO 27001
                                                </label>
                                                <Badge variant="outline" className="text-[10px] h-5">Security</Badge>
                                            </div>
                                            <div className="flex items-center space-x-2 border border-border/50 p-2 rounded-md">
                                                <Checkbox id="soc2" checked={hasSoc2} onCheckedChange={(c) => setHasSoc2(!!c)} />
                                                <label htmlFor="soc2" className="text-xs font-mono font-medium leading-none cursor-pointer flex-1">
                                                    SOC 2 Type II
                                                </label>
                                                <Badge variant="outline" className="text-[10px] h-5">Privacy</Badge>
                                            </div>
                                            <div className="flex items-center space-x-2 border border-border/50 p-2 rounded-md">
                                                <Checkbox id="gdpr" checked={hasGdpr} onCheckedChange={(c) => setHasGdpr(!!c)} />
                                                <label htmlFor="gdpr" className="text-xs font-mono font-medium leading-none cursor-pointer flex-1">
                                                    GDPR Compliant
                                                </label>
                                                <Badge variant="outline" className="text-[10px] h-5">Legal</Badge>
                                            </div>
                                        </div>
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
                                <th className="px-6 py-4 font-semibold tracking-wider">Tedarikçi</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">İletişim</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Risk Skoru</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Sertifikalar</th>
                                <th className="px-6 py-4 font-semibold tracking-wider text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {loading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin" /> Yükleniyor...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground font-mono">Henüz tedarikçi eklenmedi.</td></tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-mono text-xs">
                                                    {item.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-mono font-bold text-foreground">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                            <div className="flex flex-col">
                                                <span className="text-foreground">{item.contactName || '-'}</span>
                                                <span className="text-[10px]">{item.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`font-mono text-[10px] ${
                                                item.riskScore === 'CRITICAL' ? 'border-rose-500 text-rose-500 bg-rose-500/10' :
                                                item.riskScore === 'HIGH' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                                                item.riskScore === 'MEDIUM' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                                                'border-emerald-500 text-emerald-500 bg-emerald-500/10'
                                            }`}>
                                                {item.riskScore}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {item.hasIso27001 && <Badge variant="secondary" className="text-[9px] font-mono">ISO 27001</Badge>}
                                                {item.hasSoc2 && <Badge variant="secondary" className="text-[9px] font-mono">SOC 2</Badge>}
                                                {item.hasGdpr && <Badge variant="secondary" className="text-[9px] font-mono">GDPR</Badge>}
                                                {!item.hasIso27001 && !item.hasSoc2 && !item.hasGdpr && <span className="text-[10px] text-muted-foreground font-mono">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDelete(item.id)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
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
