"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Raporlar
        </h2>
        <div className="flex items-center gap-2">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filtrele</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Dışa Aktar</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Rapor</CardTitle>
            <FileText className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+14 geçen aydan beri</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
              <CardTitle>Son Oluşturulan Raporlar</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                  Henüz kaydedilmiş rapor bulunmuyor. Politika veya Uyumluluk sayfalarından rapor oluşturabilirsiniz.
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
