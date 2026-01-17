"use client";

import { useState, useEffect, useRef } from "react";
import { assets } from "@/lib/api";
import { Server, RefreshCw, Loader2, Database, HardDrive, Shield, Laptop, Network, Cloud, Plus, Smartphone, AppWindow, Calendar, FileSpreadsheet, Pencil, Trash, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as XLSX from 'xlsx';
import Cookies from "js-cookie";

export default function AssetsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [activeTab, setActiveTab] = useState("hardware");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAsset, setNewAsset] = useState<any>({ 
      name: '', type: 'WORKSTATION', provider: 'ENDPOINT', 
      serialNumber: '', assignedTo: '', 
      bitlocker: false, antivirus: false,
      licenseKey: '', licenseExpiry: ''
  });
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
      try {
          const res = await assets.getAll();
          setItems(res.data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const handleCreateOrUpdate = async () => {
      if (!newAsset.name) return;
      setCreating(true);
      
      const details: any = { added: 'Manually', date: new Date() };
      
      if (activeTab === 'hardware') {
          details.serialNumber = newAsset.serialNumber;
          details.assignedTo = newAsset.assignedTo;
          details.bitlocker = newAsset.bitlocker;
          details.antivirus = newAsset.antivirus;
      } else {
          details.licenseKey = newAsset.licenseKey;
          details.licenseExpiry = newAsset.licenseExpiry;
      }

      const payload = {
          name: newAsset.name,
          type: activeTab === 'hardware' ? newAsset.type : 'SOFTWARE_LICENSE',
          provider: activeTab === 'hardware' ? newAsset.provider : 'SOFTWARE',
          status: 'ACTIVE',
          details: details
      };

      try {
          if (editingId) {
             await assets.update(editingId, payload);
          } else {
             await assets.create(payload);
          }
          
          setIsAddOpen(false);
          resetForm();
          fetchAssets();
      } catch (e) {
          console.error(e);
          alert('İşlem sırasında hata oluştu.');
      } finally {
          setCreating(false);
      }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Bu varlığı silmek istediğinize emin misiniz?")) return;
      try {
          await assets.remove(id);
          fetchAssets();
      } catch(e) {
          console.error(e);
          alert("Silme işlemi başarısız.");
      }
  }

  const handleEdit = (asset: any) => {
      setEditingId(asset.id);
      setIsAddOpen(true);
      
      if(asset.type === 'SOFTWARE_LICENSE') {
          setActiveTab('software');
          setNewAsset({
             name: asset.name,
             type: asset.type,
             provider: asset.provider,
             licenseKey: asset.details?.licenseKey || '',
             licenseExpiry: asset.details?.licenseExpiry || '',
             serialNumber: '', assignedTo: '', bitlocker: false, antivirus: false
          });
      } else {
          setActiveTab('hardware');
          setNewAsset({
             name: asset.name,
             type: asset.type,
             provider: asset.provider,
             serialNumber: asset.details?.serialNumber || '',
             assignedTo: asset.details?.assignedTo || '',
             bitlocker: asset.details?.bitlocker || false,
             antivirus: asset.details?.antivirus || false,
             licenseKey: '', licenseExpiry: ''
          });
      }
  }

  const resetForm = () => {
      setEditingId(null);
      setNewAsset({ 
        name: '', type: 'WORKSTATION', provider: 'ENDPOINT', 
        serialNumber: '', assignedTo: '', 
        bitlocker: false, antivirus: false, 
        licenseKey: '', licenseExpiry: '' 
      });
  }

  const handleDownloadTemplate = () => {
      const templateData = [
          { Name: 'Ornek-Laptop-01', Type: 'WORKSTATION', SerialNumber: 'ABC12345', AssignedTo: 'Ahmet Yilmaz' },
          { Name: 'Ornek-Sunucu-DB', Type: 'SERVER', SerialNumber: 'SRV998877', AssignedTo: 'Murat Demir' }
      ];
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "varlik_yukleme_sablonu.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. Security: Check File Size (Max 2MB)
      if (file.size > 2 * 1024 * 1024) {
          alert("Dosya boyutu çok büyük (Max 2MB).");
          return;
      }

      // 2. Security: Check File Type (Extension & MIME)
      const validTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel' // .xls
      ];
      const validExtensions = ['.xlsx', '.xls'];
      
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
          alert("Geçersiz dosya formatı. Lütfen sadece .xlsx veya .xls uzantılı Excel dosyaları yükleyiniz.");
          return;
      }

      const reader = new FileReader();
      reader.onload = async (evt) => {
          try {
              const bstr = evt.target?.result;
              const wb = XLSX.read(bstr, { type: 'binary' });
              const wsname = wb.SheetNames[0];
              const ws = wb.Sheets[wsname];
              const data = XLSX.utils.sheet_to_json(ws);

              if (data.length === 0) {
                  alert("Excel dosyası boş.");
                  return;
              }

              // 2. Validation: Check Headers
              const firstRow = data[0] as any;
              const requiredColumns = ['Name', 'Type'];
              const missingColumns = requiredColumns.filter(col => !(col in firstRow) && !(col.toLowerCase() in firstRow));

              if (missingColumns.length > 0) {
                  alert(`Hatalı Format: Eksik sütunlar -> ${missingColumns.join(', ')}. Lütfen şablonu indirin.`);
                  return;
              }

              // Map Excel data to Asset structure
              // Expected headers: Name, Type, SerialNumber, AssignedTo
              const mappedAssets = data.map((row: any) => ({
                  name: row.Name || row.name || 'Unnamed Asset',
                  type: row.Type ? row.Type.toUpperCase() : 'WORKSTATION',
                  provider: 'ENDPOINT',
                  status: 'ACTIVE',
                  details: {
                      serialNumber: row.SerialNumber || row.serialNumber,
                      assignedTo: row.AssignedTo || row.assignedTo,
                      added: 'Bulk Import'
                  }
              }));

              if(mappedAssets.length > 0) {
                 await assets.createBulk({ items: mappedAssets });
                 fetchAssets();
                 alert(`${mappedAssets.length} varlık başarıyla içeri aktarıldı.`);
              } else {
                 alert("Excel dosyasında uygun veri bulunamadı.");
              }

          } catch (err) {
              console.error(err);
              alert("Dosya okuma hatası veya bozuk format.");
          }
      };
      reader.readAsBinaryString(file);
      // Reset input manually so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'WORKSTATION': return <Laptop className="h-4 w-4 text-blue-500" />;
          case 'SERVER': return <Server className="h-4 w-4 text-purple-500" />;
          case 'NETWORK_DEVICE': return <Network className="h-4 w-4 text-orange-500" />;
          case 'EC2_INSTANCE': return <Server className="h-4 w-4 text-emerald-500" />;
          case 'S3_BUCKET': return <HardDrive className="h-4 w-4 text-yellow-500" />;
          case 'IAM_USER': return <Shield className="h-4 w-4 text-red-500" />;
          case 'SOFTWARE_LICENSE': return <AppWindow className="h-4 w-4 text-pink-500" />;
          default: return <Database className="h-4 w-4 text-gray-500" />;
      }
  };

  const getStatusColor = (status: string) => {
      if(status === 'ACTIVE' || status === 'RUNNING') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      if(status === 'STOPPED') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  const stats = {
      total: items.length,
      software: items.filter(i => i.type === 'SOFTWARE_LICENSE').length,
      hardware: items.filter(i => i.provider === 'ENDPOINT' || i.provider === 'ON_PREM').length,
      secure: items.filter(i => i.details?.bitlocker || i.details?.antivirus).length
  };

  const [isAuditor, setIsAuditor] = useState(false);
  useEffect(() => {
      setIsAuditor(Cookies.get("user_role") === "AUDITOR");
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Varlık ve Lisans Yönetimi</h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
             Hardware Inventory • Software Registry • Endpoint Security
          </p>
        </div>
        
        {!isAuditor && (
        <div className="flex gap-3">
             <Button variant="secondary" className="gap-2" onClick={handleDownloadTemplate}>
                <FileSpreadsheet className="h-4 w-4" />
                Şablon İndir
             </Button>

             <div className="relative">
                <Input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
                <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="h-4 w-4 text-green-600" />
                    Excel Yükle
                </Button>
            </div>
        </div>
        )}

        {!isAuditor && (
            <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if(!open) resetForm(); }}>
                <DialogTrigger asChild>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Varlık / Lisans Ekle
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Varlığı Düzenle" : "Envantere Kayıt Ekle"}</DialogTitle>
                    </DialogHeader>
                    
                    <Tabs defaultValue="hardware" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="hardware" disabled={!!editingId && activeTab !== 'hardware'}>Donanım & Cihaz</TabsTrigger>
                            <TabsTrigger value="software" disabled={!!editingId && activeTab !== 'software'}>Yazılım & Lisans</TabsTrigger>
                        </TabsList>
                        
                        {/* HARDWARE FORM */}
                        <TabsContent value="hardware" className="space-y-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Cihaz Adı</Label>
                                <Input className="col-span-3" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} placeholder="Örn: Ahmet-Macbook-Pro" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Tür</Label>
                                <select className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={newAsset.type} onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}>
                                    <option value="WORKSTATION">Workstation (Laptop/PC)</option>
                                    <option value="SERVER">Server (Sunucu)</option>
                                    <option value="NETWORK_DEVICE">Network (Firewall/Switch)</option>
                                    <option value="MOBILE">Mobile (Telefon/Tablet)</option>
                                </select>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Lokasyon</Label>
                                <select className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={newAsset.provider} onChange={(e) => setNewAsset({...newAsset, provider: e.target.value})}>
                                    <option value="ENDPOINT">Kullanıcı Zimmetli</option>
                                    <option value="ON_PREM">Ofis / Sistem Odası</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Seri No</Label>
                                <Input className="col-span-3" value={newAsset.serialNumber} onChange={(e) => setNewAsset({...newAsset, serialNumber: e.target.value})} placeholder="S/N" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Atanan Kişi</Label>
                                <Input className="col-span-3" value={newAsset.assignedTo} onChange={(e) => setNewAsset({...newAsset, assignedTo: e.target.value})} placeholder="Örn: Ahmet Yılmaz" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4 pt-2">
                                 <Label className="text-right">Güvenlik</Label>
                                 <div className="col-span-3 flex gap-4">
                                     <div className="flex items-center space-x-2">
                                        <Checkbox id="bitlocker" checked={newAsset.bitlocker} onCheckedChange={(c) => setNewAsset({...newAsset, bitlocker: c})} />
                                        <label htmlFor="bitlocker" className="text-sm font-medium leading-none">Disk Şifreleme (BitLocker)</label>
                                     </div>
                                 </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                 <Label className="text-right"></Label>
                                 <div className="col-span-3 flex gap-4">
                                     <div className="flex items-center space-x-2">
                                        <Checkbox id="av" checked={newAsset.antivirus} onCheckedChange={(c) => setNewAsset({...newAsset, antivirus: c})} />
                                        <label htmlFor="av" className="text-sm font-medium leading-none">Antivirus Yüklü</label>
                                     </div>
                                 </div>
                            </div>
                        </TabsContent>

                        {/* SOFTWARE FORM */}
                        <TabsContent value="software" className="space-y-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Yazılım Adı</Label>
                                <Input className="col-span-3" value={newAsset.name} onChange={(e) => setNewAsset({...newAsset, name: e.target.value})} placeholder="Örn: Microsoft Office 365" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Lisans Anahtarı</Label>
                                <Input className="col-span-3" value={newAsset.licenseKey} onChange={(e) => setNewAsset({...newAsset, licenseKey: e.target.value})} placeholder="XXXX-XXXX-XXXX-XXXX" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Bitiş Tarihi</Label>
                                <Input type="date" className="col-span-3" value={newAsset.licenseExpiry} onChange={(e) => setNewAsset({...newAsset, licenseExpiry: e.target.value})} />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button onClick={handleCreateOrUpdate} disabled={creating}>
                            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {editingId ? 'Güncelle' : (activeTab === 'hardware' ? 'Cihazı Kaydet' : 'Lisansı Kaydet')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
      </div>
      
      {!isAuditor && (
      <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/20 text-amber-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Önemli Beyan Uyarısı</AlertTitle>
        <AlertDescription>
          Bu sayfadaki veriler <strong>beyan esaslıdır</strong> (self-declared). Denetimlerde sürpriz yaşamamak için envanterinizin güncel ve doğru olduğundan emin olunuz. Eksik veya hatalı bildirimler uyumluluk puanınızı düşürebilir.
        </AlertDescription>
      </Alert>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Toplam Varlık</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold font-mono">{stats.total}</div></CardContent>
          </Card>
          <Card className="bg-card/50">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Donanım Envanteri</CardTitle>
                  <Laptop className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold font-mono">{stats.hardware}</div>
                  <p className="text-xs text-muted-foreground mt-1">PC, Server, Network</p>
              </CardContent>
          </Card>
          <Card className="bg-card/50">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Yazılım Kayıtları</CardTitle>
                  <AppWindow className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold font-mono">{stats.software}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lisanslar & Abonelikler</p>
              </CardContent>
          </Card>
          <Card className="bg-card/50">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Güvenli Endpoint</CardTitle>
                  <Shield className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold font-mono">{stats.secure}</div>
                  <p className="text-xs text-muted-foreground mt-1">Disk Şifreleme Aktif</p>
              </CardContent>
          </Card>
      </div>

      {/* ASSET TABLE */}
      <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-muted/40 border-b border-border">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Varlık / Yazılım</th>
                    <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Tür</th>
                    <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Detaylar</th>
                    <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Güvenlik / Durum</th>
                    <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide text-right">Statü</th>
                    {!isAuditor && <th className="w-[50px]"></th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
                {loading ? (
                     <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground font-mono">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                            Envanter yükleniyor...
                        </td>
                     </tr>
                ) : items.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground font-mono">
                            <Database className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                            Henüz kayıt bulunamadı.
                        </td>
                    </tr>
                ) : (
                    items.map((asset) => (
                    <tr key={asset.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                {getIcon(asset.type)}
                                <div className="flex flex-col">
                                    <span className="font-bold font-mono text-sm text-foreground">{asset.name}</span>
                                    {asset.details?.ip && <span className="text-[10px] text-muted-foreground font-mono">IP: {asset.details.ip}</span>}
                                    {asset.details?.serialNumber && <span className="text-[10px] text-muted-foreground font-mono">S/N: {asset.details.serialNumber}</span>}
                                    {asset.details?.licenseKey && <span className="text-[10px] text-muted-foreground font-mono">Lic: ****-{asset.details.licenseKey.slice(-4)}</span>}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground font-medium">
                            {asset.type.replace('_', ' ')}
                            {asset.type === 'SOFTWARE_LICENSE' && asset.details?.licenseExpiry && (
                                <div className="flex items-center text-[10px] mt-1 text-red-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Exp: {asset.details.licenseExpiry}
                                </div>
                            )}
                        </td>
                         <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                            {asset.details?.assignedTo ? (
                                <span className="flex items-center gap-1">User: <span className="text-foreground">{asset.details.assignedTo}</span></span>
                            ) : asset.provider}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                            <div className="flex gap-2">
                                {asset.details?.bitlocker && <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500 h-5">Full Disk Encrypted</Badge>}
                                {asset.details?.antivirus && <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 h-5">AV Protected</Badge>}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold font-mono rounded-full border ${getStatusColor(asset.status)}`}>
                                 {asset.status}
                             </span>
                        </td>
                        {!isAuditor && (
                        <td className="px-6 py-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(asset)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Düzenle
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleDelete(asset.id)}>
                                        <Trash className="mr-2 h-4 w-4" /> Sil
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                        )}
                    </tr>
                )))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
