"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Copy, Check } from "lucide-react";
import { audit } from "@/lib/api";

export function ShareDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", hours: "24" });
  const [copied, setCopied] = useState(false);
  
  // Active Shares List
  const [shares, setShares] = useState<any[]>([]);
  const [loadingShares, setLoadingShares] = useState(false);

  const fetchShares = async () => {
      setLoadingShares(true);
      try {
          const res = await audit.list();
          setShares(res.data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingShares(false);
      }
  };

  const handleOpen = (val: boolean) => {
      setIsOpen(val);
      if (val) {
          fetchShares();
      } else {
          reset();
      }
  };

  const handleCreate = async () => {
      setLoading(true);
      try {
          const res = await audit.createShare({ 
              name: formData.name || "External Auditor", 
              hours: parseInt(formData.hours) 
          });
          const fullLink = `${window.location.origin}${res.data.shareLink}`;
          setLink(fullLink);
          fetchShares(); // Refresh list
      } catch (e) {
          console.error(e);
          alert("Link oluşturulamadı.");
      } finally {
          setLoading(false);
      }
  };

  const handleRevoke = async (id: string) => {
      if(!confirm("Bu erişim linkini silmek istediğinize emin misiniz?")) return;
      try {
          await audit.revoke(id);
          fetchShares();
      } catch (e) {
          console.error(e);
          alert("Silinemedi.");
      }
  };

  const handleCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
      setLink(null);
      setFormData({ name: "", hours: "24" });
      setCopied(false);
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour:'2-digit', minute:'2-digit'});
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-dashed border-primary/50 hover:border-primary text-primary hover:bg-primary/5">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Denetçi Paylaşımı</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Güvenli Paylaşım (Safe-Link)</DialogTitle>
          <DialogDescription>
            Denetçiler için sadece okunabilir, süreli erişim linkleri yönetin.
          </DialogDescription>
        </DialogHeader>
        
        {/* NEW SHARE FORM */}
        <div className="border-b pb-6 mb-6">
            {!link ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Referans Adı</Label>
                            <Input 
                                placeholder="Örn: Q1 Denetimi" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Süre</Label>
                            <Select value={formData.hours} onValueChange={(val) => setFormData({...formData, hours: val})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="24">24 Saat</SelectItem>
                                    <SelectItem value="48">48 Saat</SelectItem>
                                    <SelectItem value="168">7 Gün</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleCreate} disabled={loading} size="sm">
                            {loading ? "..." : "+ Link Oluştur"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md flex items-center justify-between">
                         <code className="text-xs text-green-600 font-mono flex-1 mr-2">{link}</code>
                         <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(link!)}>
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                         </Button>
                    </div>
                    <div className="flex justify-end">
                         <Button variant="ghost" size="sm" onClick={reset}>Yeni Oluştur</Button>
                    </div>
                </div>
            )}
        </div>

        {/* ACTIVE SHARES LIST */}
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${shares.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                Aktif Paylaşımlar
            </h4>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {shares.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Henüz aktif paylaşım yok.</p>
                ) : (
                    shares.map((share) => {
                        const isExpired = new Date(share.expiresAt) < new Date();
                        return (
                            <div key={share.id} className={`flex items-center justify-between p-3 rounded-lg border ${isExpired ? 'bg-muted opacity-60' : 'bg-card'}`}>
                                <div>
                                    <div className="font-medium text-sm text-foreground flex items-center gap-2">
                                        {share.name}
                                        {isExpired && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Süresi Doldu</span>}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                        Exp: {formatDate(share.expiresAt)}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => handleCopy(`${window.location.origin}/audit/access/${share.token}`)}>
                                        <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRevoke(share.id)}>
                                        <Share2 className="h-3 w-3 rotate-180" /> {/* Simulate trash/revoke with icon check maybe Trash is better but user said revoke */}
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
