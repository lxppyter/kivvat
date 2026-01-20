"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, FileText, Lock, AlertTriangle, CheckCircle2, Download, Cloud, Users, Mail, Link as LinkIcon, Copy, Info } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";

interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  status?: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING' | 'UNSCANNED';
}

interface Standard {
  id: string;
  name: string;
  description: string;
  complianceScore: number;
  analyzed?: boolean;
  controls: Control[];
}

import { auth, compliance, policy } from "@/lib/api";

export default function PoliciesPage() {
  const [isAuditor, setIsAuditor] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsAuditor(Cookies.get("user_role") === "AUDITOR");
    auth.getProfile().then(res => setUser(res.data)).catch(console.error);
  }, []);

  const [standards, setStandards] = useState<Standard[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentStats, setAssignmentStats] = useState<any>({ total: 0, signed: 0, pending: 0, overdue: 0, percentage: 0 });
  const [signatureStats, setSignatureStats] = useState<any[]>([]);
  
  // For Employee View
  const [myAssignments, setMyAssignments] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<{ id: string; name: string; content: string } | null>(null);

  // For Management
  const [managePolicy, setManagePolicy] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  // Share Management
  const [showShareManager, setShowShareManager] = useState(false);
  const [shares, setShares] = useState<any[]>([]);

  // Share Dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<string | null>(null); // 'ALL' or policyId
  const [shareResult, setShareResult] = useState<string | null>(null);
  const [shareCustomExpiry, setShareCustomExpiry] = useState("30"); // days

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
    fetchSignatures();
  }, []);

  const fetchSignatures = async () => {
      try {
          const res = await policy.getSignatures();
          setSignatureStats(res.data);
      } catch (e) {
          console.error("Failed signatures", e);
      }
  };
  
  const fetchShares = async () => {
      try {
          const res = await policy.getShares();
          setShares(res.data);
      } catch (e) {
          toast.error("Failed to load active links");
      }
  };

  const handeRevokeShare = async (id: string) => {
      if(!confirm("Are you sure you want to revoke this link? Users will no longer be able to access it.")) return;
      try {
          await policy.revokeShare(id);
          toast.success("Link revoked");
          fetchShares();
      } catch (e) {
          toast.error("Failed to revoke link");
      }
  };

  const handleCreateShare = async () => {
      try {
          const { policy } = await import("@/lib/api");
          let expiryDate: string | undefined = undefined;
          
          if (shareCustomExpiry !== "never") {
              const days = parseInt(shareCustomExpiry);
              const d = new Date();
              d.setDate(d.getDate() + days);
              expiryDate = d.toISOString();
          }

          let res;
          if (shareTarget === 'ALL') {
              res = await policy.createShareAll(expiryDate);
          } else {
              if(!shareTarget) return;
              res = await policy.createShare(shareTarget, expiryDate);
          }

          setShareResult(res.data.url);
          // fetchShares(); // Optional: refresh list immediately if we want
      } catch (e: any) {
          toast.error("Failed to generate link", { description: e.response?.data?.message });
      }
  };

  const fetchPolicies = async () => {
        try {
            // First get profile
            const { auth } = await import("@/lib/api");
            let profileId;
            try {
                const profileRes = await auth.getProfile();
                profileId = profileRes.data.id;
            } catch (e) {
                console.warn("Not logged in");
            }

            const [stdRes, tmplRes, assignRes, myAssignRes] = await Promise.all([
                compliance.getStandards(),
                (await import("@/lib/api")).policy.getTemplates(),
                (await import("@/lib/api")).policy.getAssignments(), // All (Admin view)
                profileId ? (await import("@/lib/api")).policy.getAssignments(profileId) : Promise.resolve({ data: { assignments: [] } })
            ]);
            
            setStandards(stdRes.data);
            setTemplates(tmplRes.data);
            setAssignments(assignRes.data.assignments);
            setAssignmentStats(assignRes.data.stats);
            setMyAssignments(myAssignRes.data.assignments || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
          Policy & Compliance Frameworks
        </h1>
        <p className="text-muted-foreground">
          Track compliance gaps, manage policy documents, and automate evidence collection.
        </p>
      </div>

      {loading ? (
        <div className="flex gap-4"><div className="w-full h-32 bg-muted/20 animate-pulse rounded-lg"/></div>
      ) : (
        <Tabs defaultValue="dashboard" className="w-full space-y-6">
            <TabsList className="bg-muted/50 p-1 w-full flex flex-wrap h-auto gap-1">
                <TabsTrigger value="dashboard" className="flex-1 min-w-fit">Gap Analysis Dashboard</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1 min-w-fit">Document Library ({templates.length})</TabsTrigger>
                <TabsTrigger value="signatures" className="flex-1 min-w-fit">Signatures & Status</TabsTrigger>
                <TabsTrigger value="controls" className="flex-1 min-w-fit">All Controls ({standards.reduce((acc, s) => acc + s.controls.length, 0)})</TabsTrigger>
            </TabsList>

            {/* DASHBOARD TAB */}
            <TabsContent value="dashboard" className="space-y-6">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {standards.some(s => s.analyzed) ? (standards.length > 0 ? Math.round(standards.reduce((acc, s) => acc + s.complianceScore, 0) / standards.length) : 0) + "%" : "-"}
                            </div>
                            <p className="text-xs text-muted-foreground">Across all standards</p>
                            <Progress value={standards.some(s => s.analyzed) && standards.length > 0 ? Math.round(standards.reduce((acc, s) => acc + s.complianceScore, 0) / standards.length) : 0} className="mt-3 h-2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {standards.some(s => s.analyzed) ? standards.reduce((acc, s) => acc + s.controls.filter(c => c.status === 'NON_COMPLIANT' || c.status === 'PENDING').length, 0) : "-"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {standards.some(s => s.analyzed) ? "High priority issues" : "Analysis Required"}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Auto-Verified</CardTitle>
                            <Cloud className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {standards.some(s => s.analyzed) ? standards.reduce((acc, s) => acc + s.controls.filter(c => c.status === 'COMPLIANT').length, 0) : "-"}
                            </div>
                            <p className="text-xs text-muted-foreground">Controls monitored by Rule Engine</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Employee Signatures</CardTitle>
                            <Users className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{assignmentStats.signed}/{assignmentStats.total}</div>
                            <p className="text-xs text-muted-foreground">Policies signed by staff</p>
                            <Progress value={assignmentStats.percentage} className="mt-3 h-2" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {standards.map(std => (
                         <Card key={std.id} className="border-border/50">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{std.name}</CardTitle>
                                        <CardDescription>{std.description}</CardDescription>
                                    </div>
                                    <Badge variant={std.complianceScore > 80 ? 'default' : 'secondary'} className="text-lg">
                                        {std.complianceScore}%
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Compliance Progress</span>
                                        <span className="text-muted-foreground">{std.complianceScore}%</span>
                                    </div>
                                    <Progress value={std.complianceScore} className="h-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-4">
                                     <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                        <span className="block text-2xl font-bold text-red-500">
                                            {std.controls.filter(c => c.status === 'NON_COMPLIANT').length}
                                        </span>
                                        <span className="text-xs text-red-400 font-medium">Non-Compliant</span>
                                     </div>
                                     <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                        <span className="block text-2xl font-bold text-emerald-500">
                                             {std.controls.filter(c => c.status === 'COMPLIANT').length}
                                        </span>
                                        <span className="text-xs text-emerald-400 font-medium">Compliant</span>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            {/* DOCUMENTS TAB */}
            <TabsContent value="documents" className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Required Policy Documents</CardTitle>
                            <CardDescription>
                                Manage your company's policy templates and versioning.
                            </CardDescription>
                        </div>
                        {!isAuditor && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                                setShareTarget('ALL');
                                setShareResult(null);
                                setShareDialogOpen(true);
                            }}>
                                <LinkIcon className="h-4 w-4 mr-2" /> Share Policy Portal
                            </Button>
                        )}
                    </CardHeader>
                    { !isAuditor && (
                         <div className="px-6 pb-2 text-right">
                             <Button variant="ghost" size="sm" onClick={() => { setShowShareManager(true); fetchShares(); }}>
                                 Manage Active Links
                             </Button>
                         </div>
                    )}
                    <CardContent className="p-0">
                         <div className="divide-y divide-border/50">
                            {templates.map((tmpl, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{tmpl.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate">Category: {tmpl.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                                            available
                                        </Badge>
                                        
                                        {!isAuditor ? (
                                            <>
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="gap-2"
                                                    onClick={async () => {
                                                        const { policy } = await import("@/lib/api");
                                                        const res = await policy.getHistory(tmpl.id);
                                                        setHistory(res.data);
                                                        setManagePolicy({ ...tmpl, content: tmpl.content, version: tmpl.version || '1.0' });
                                                    }}
                                                >
                                                    <Lock className="h-3 w-3" /> Manage
                                                </Button>

                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="gap-2"
                                                    onClick={async () => {
                                                        try {
                                                            const { policy } = await import("@/lib/api");
                                                            const res = await policy.download(tmpl.id, "Demo Company Ltd.");
                                                            const blob = new Blob([res.data.content], { type: 'text/markdown' });
                                                            const url = window.URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `${res.data.name.replace(/\s+/g, '_')}_Template.md`;
                                                            document.body.appendChild(a);
                                                            a.click();
                                                            window.URL.revokeObjectURL(url);
                                                            document.body.removeChild(a);
                                                        } catch (e) {
                                                            alert("Failed to download template");
                                                        }
                                                    }}
                                                >
                                                    <Download className="h-3 w-3" /> Template
                                                </Button>
                                            </>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                variant="secondary" 
                                                className="gap-2"
                                                onClick={() => {
                                                    setSelectedPolicy({
                                                        id: tmpl.id,
                                                        name: tmpl.name,
                                                        content: tmpl.content
                                                    });
                                                }}
                                            >
                                                <FileText className="h-3 w-3" /> View
                                            </Button>
                                        )}
                                        
                                        {!isAuditor && (
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                onClick={() => {
                                                    setShareTarget(tmpl.id);
                                                    setShareResult(null);
                                                    setShareDialogOpen(true);
                                                }}
                                            >
                                                <LinkIcon className="h-3 w-3" /> Share
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
            
            {/* SIGNATURES & STATUS TAB (Combined View) */}
            <TabsContent value="signatures" className="space-y-6">
                 {/* 1. My Actions Section */}
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-orange-500" />
                            My Pending Actions
                        </CardTitle>
                        <CardDescription>
                            Policies that require your attention and digital signature.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-4 bg-blue-50/50 border-b border-blue-100 text-xs text-blue-700 font-mono">
                            <span className="font-bold">BİLGİ:</span> "Dijital İmza", politikanın okunduğunu ve kabul edildiğini zaman damgasıyla (timestamp) kayıt altına alır. Islak imza gerektirmez.
                        </div>
                         <div className="divide-y divide-border/50">
                            {myAssignments.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <ShieldCheck className="h-12 w-12 mx-auto text-emerald-500/50 mb-3" />
                                    You have no pending policy actions.
                                </div>
                            ) : (
                                myAssignments.map((assignment, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-orange-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm">{assignment.policy.name}</h4>
                                                <p className="text-xs text-muted-foreground">Category: {assignment.policy.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {assignment.status === 'SIGNED' ? (
                                                <Badge className="bg-emerald-500">Signed on {new Date(assignment.signedAt).toLocaleDateString()}</Badge>
                                            ) : (
                                                <Button size="sm" onClick={async () => {
                                                    try {
                                                        const { policy } = await import("@/lib/api");
                                                        // Fetch content dynamically
                                                        const res = await policy.download(assignment.policyId, "My Company Ltd.");
                                                        setSelectedPolicy({
                                                            id: assignment.id,
                                                            name: res.data.name,
                                                            content: res.data.content,
                                                        });
                                                    } catch (e) {
                                                        console.error(e);
                                                    }
                                                }}>
                                                    Read & Sign
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                         </div>
                    </CardContent>
                </Card>

                 {/* 2. Team Overview Section */}
                 <div className="grid gap-4 md:grid-cols-3">
                     <Card>
                         <CardHeader className="pb-2">
                             <CardTitle className="text-sm font-medium">Pending Acknowledgments</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="text-2xl font-bold text-amber-500">{assignmentStats.pending}</div>
                             <p className="text-xs text-muted-foreground">Team members yet to sign</p>
                         </CardContent>
                     </Card>
                     <Card>
                         <CardHeader className="pb-2">
                             <CardTitle className="text-sm font-medium">Completed</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="text-2xl font-bold text-emerald-500">{assignmentStats.signed}</div>
                             <p className="text-xs text-muted-foreground">Fully compliant members</p>
                         </CardContent>
                     </Card>
                     <Card>
                         <CardHeader className="pb-2">
                             <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="text-2xl font-bold text-red-500">{assignmentStats.overdue}</div>
                             <p className="text-xs text-muted-foreground">&gt; 30 days pending</p>
                         </CardContent>
                     </Card>
                 </div>
                 
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>All Signatures</CardTitle>
                            <CardDescription>
                                Track adherence to mandatory security policies across the organization.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Buttons removed as requested: Employee flow is now via Public Portal Link */}
                        </div>

                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {signatureStats.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground font-mono">Veri bulunamadı.</div>
                            ) : (
                                signatureStats.map((stat) => (
                                    <div key={stat.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between p-4 border rounded-lg bg-card/40">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                                                {stat.name ? stat.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium font-mono truncate">{stat.name}</p>
                                                <p className="text-xs text-muted-foreground font-mono truncate">{stat.email} • {stat.role || 'STAFF'}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-muted-foreground font-mono">İmzalanan</p>
                                                <p className="text-sm font-bold font-mono">{stat.signedCount} / {stat.totalPolicies}</p>
                                            </div>
                                            
                                            {stat.lastIp && (
                                                <div 
                                                    className="cursor-help" 
                                                    title={`Audit Log\nIP: ${stat.lastIp}\nDevice: ${stat.lastUserAgent || 'Unknown'}\nTimestamp: ${new Date(stat.lastSigned).toLocaleString()}`}
                                                >
                                                    <Info className="h-4 w-4 text-blue-500/70 hover:text-blue-600" />
                                                </div>
                                            )}

                                            <Badge variant="outline" className={`font-mono ${stat.status === 'COMPLIANT' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                {stat.status === 'COMPLIANT' ? 'TAMAMLANDI' : 'BEKLİYOR'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* MANAGE DIALOG (Edit & History) */}
            <Dialog open={!!managePolicy} onOpenChange={(open) => !open && setManagePolicy(null)}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{managePolicy?.name} - Version Management</DialogTitle>
                        <DialogDescription>
                            Update policy content or view previous versions.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="edit" className="flex-1 flex flex-col overflow-hidden">
                        <TabsList>
                            <TabsTrigger value="edit">Edit Current Version (v{managePolicy?.version})</TabsTrigger>
                            <TabsTrigger value="history">Version History</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="edit" className="flex-1 flex flex-col gap-4 mt-4 overflow-hidden">
                            <textarea 
                                className="flex-1 w-full p-4 font-mono text-sm border rounded-md bg-muted/30 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                value={managePolicy?.content || ''}
                                onChange={(e) => setManagePolicy((prev: any) => prev ? { ...prev, content: e.target.value } : null)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setManagePolicy(null)}>Cancel</Button>
                                <Button onClick={async () => {
                                    if (!managePolicy) return;
                                    try {
                                        const { policy } = await import("@/lib/api");
                                        await policy.update(managePolicy.id, managePolicy.content);
                                        alert("Policy updated! A new version has been created.");
                                        setManagePolicy(null);
                                        // Refresh
                                        window.location.reload(); 
                                    } catch (e) {
                                        alert("Failed to update policy");
                                    }
                                }}>
                                    Save New Version
                                </Button>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="history" className="flex-1 overflow-auto mt-4">
                            <div className="border rounded-md">
                                <div className="grid grid-cols-3 p-3 bg-muted font-medium text-sm">
                                    <div>Version</div>
                                    <div>Date Archived</div>
                                    <div>Action</div>
                                </div>
                                <div className="divide-y">
                                    {history.length === 0 && <div className="p-4 text-center text-muted-foreground">No history found.</div>}
                                    {history.map((h: any) => (
                                        <div key={h.id} className="grid grid-cols-3 p-3 text-sm items-center hover:bg-muted/30">
                                            <div className="font-mono">v{h.version}</div>
                                            <div>{new Date(h.createdAt).toLocaleString()}</div>
                                            <div>
                                                <Button size="sm" variant="ghost" onClick={() => {
                                                    alert(`Content of v${h.version}:\n\n${h.content.substring(0, 200)}...`);
                                                }}>View Content</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedPolicy} onOpenChange={(open) => !open && setSelectedPolicy(null)}>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{selectedPolicy?.name}</DialogTitle>
                        <DialogDescription>
                            Please read the entire document below.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 border rounded-md p-4 bg-muted/30">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm">
                                {selectedPolicy?.content}
                            </pre>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 w-full">
                        <span className="text-xs text-muted-foreground text-center sm:text-left">
                            By clicking "I Agree", you digitally sign this document with timestamp.
                        </span>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button variant="outline" onClick={() => setSelectedPolicy(null)}>Cancel</Button>
                            {!isAuditor && (
                                <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap px-6" onClick={async () => {
                                    if (!selectedPolicy) return;
                                    try {
                                        const { policy } = await import("@/lib/api");
                                        await policy.sign(selectedPolicy.id);
                                        
                                        // Optimistic update
                                        setMyAssignments(prev => prev.map(a => 
                                            a.id === selectedPolicy.id ? { ...a, status: 'SIGNED', signedAt: new Date().toISOString() } : a
                                        ));
                                        
                                        // Update stats as well
                                        const { policy: p } = await import("@/lib/api");
                                        const assignRes = await p.getAssignments();
                                        setAssignments(assignRes.data.assignments);
                                        setAssignmentStats(assignRes.data.stats);

                                        setSelectedPolicy(null);
                                        alert("Policy signed successfully!");
                                    } catch (e) {
                                        alert("Failed to sign policy");
                                    }
                                }}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    I Agree & Sign
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CONTROLS LIST TAB (Original View) */}
            <TabsContent value="controls">
                {(!user || !['PRO', 'ENTERPRISE'].includes(user.plan)) ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-muted/30">
                        <Lock className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">Detailed Control Monitoring</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            Access to granular control status, evidence audit trails, and specific compliance mapping is available only on <strong>Trust Architect</strong> and above.
                        </p>
                        <Button onClick={() => window.location.href = '/settings/billing'} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                            Upgrade to Unlock
                        </Button>
                    </div>
                ) : (
                <div className="grid gap-6">
                    {standards.map((std) => (
                        <div key={std.id} className="border border-border/50 rounded-xl overflow-hidden bg-card shadow-sm">
                            <div className="p-4 bg-muted/10 border-b border-border/50 flex items-center justify-between">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    {std.name}
                                </h2>
                                <Badge variant="outline">{std.controls.length} Controls</Badge>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                {std.controls.map((control) => (
                                    <AccordionItem key={control.id} value={control.id} className="border-b last:border-0 border-border/40 px-6">
                                        <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex items-center gap-4 text-left flex-1">
                                                <Badge variant="secondary" className="font-mono text-xs w-20 justify-center">
                                                    {control.code}
                                                </Badge>
                                                <span className="font-medium text-sm flex-1">{control.name}</span>
                                                {control.status === 'COMPLIANT' && (
                                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 mr-4">Passed</Badge>
                                                )}
                                                {control.status === 'NON_COMPLIANT' && (
                                                    <Badge variant="destructive" className="mr-4">Failed</Badge>
                                                )}
                                                {control.status === 'PENDING' && (
                                                    <Badge variant="outline" className="text-muted-foreground mr-4">Pending</Badge>
                                                )}
                                                {control.status === 'UNSCANNED' && (
                                                    <Badge variant="outline" className="text-muted-foreground/50 mr-4 border-dashed">Not Scanned</Badge>
                                                )}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4 pt-1 pl-24 pr-4">
                                            <p className="text-sm text-muted-foreground mb-4">{control.description}</p>
                                            
                                            {/* EVIDENCE HISTORY */}
                                            <div className="border-t border-border/50 pt-4">
                                                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Audit Trail & Evidence</h4>
                                                 <div className="space-y-2">
                                                     <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={async (e) => {
                                                         try {
                                                             const { evidence } = await import("@/lib/api");
                                                             const res = await evidence.getHistory(control.id);
                                                             console.log(res.data);
                                                             if(res.data.length > 0) {
                                                                 // Go to latest report
                                                                 window.open(`/reports/evidence/${res.data[0].id}`, '_blank');
                                                             } else {
                                                                 alert("No evidence history found for this control.");
                                                             }
                                                         } catch(err) {
                                                             console.error(err);
                                                             alert("Failed to fetch history");
                                                         }
                                                     }}>
                                                         <FileText className="h-3 w-3" /> View Evidence Report
                                                     </Button>
                                                 </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>
                )}
            </TabsContent>
        </Tabs>
      )}
      <Dialog open={showShareManager} onOpenChange={setShowShareManager}>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>Active Public Links</DialogTitle>
                <DialogDescription>
                    Manage active sharing links. Revoked links will strictly deny access immediately.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium text-sm">
                        <div className="col-span-2">Type / Policy</div>
                        <div>Created</div>
                        <div>Expires</div>
                        <div className="text-right">Action</div>
                    </div>
                    <div className="divide-y max-h-[400px] overflow-y-auto">
                        {shares.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">No active links found.</div>
                        ) : (
                            shares.map((share: any) => (
                                <div key={share.id} className="grid grid-cols-5 gap-4 p-4 text-sm items-center">
                                    <div className="col-span-2">
                                        <div className="font-medium">
                                            {share.policyId ? share.policy?.name : "Company Policy Portal"}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate font-mono mt-1">
                                            {share.token}
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground">
                                        {new Date(share.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="text-muted-foreground">
                                        {share.expiresAt ? new Date(share.expiresAt).toLocaleDateString() : 'Never'}
                                    </div>
                                    <div className="text-right flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => {
                                            const url = window.location.origin + (share.policyId ? `/public/policy/${share.token}` : `/public/portal/${share.token}`);
                                            navigator.clipboard.writeText(url);
                                            toast.success("Link copied");
                                        }}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handeRevokeShare(share.id)}>
                                            Revoke
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowShareManager(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Share Public Link</DialogTitle>
                <DialogDescription>
                    Create a secure link for non-registered users to sign {shareTarget === 'ALL' ? 'all policies in the portal' : 'this policy'}.
                </DialogDescription>
            </DialogHeader>
            
            {shareResult ? (
                <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">Link</Label>
                            <Input id="link" value={shareResult} readOnly />
                        </div>
                        <Button size="sm" className="px-3" onClick={() => {
                            navigator.clipboard.writeText(shareResult);
                            toast.success("Copied to clipboard");
                        }}>
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground bg-blue-50 text-blue-800 p-3 rounded-md">
                        <p>Tip: Any existing active link for this policy is reused.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Expiration</Label>
                        <select 
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={shareCustomExpiry}
                            onChange={(e) => setShareCustomExpiry(e.target.value)}
                        >
                            <option value="7">7 Days</option>
                            <option value="30">30 Days (Standard)</option>
                            <option value="90">90 Days</option>
                            <option value="never">Never Expire</option>
                        </select>
                    </div>
                </div>
            )}

            <DialogFooter className="sm:justify-end">
                <Button variant="secondary" type="button" onClick={() => setShareDialogOpen(false)}>
                    Close
                </Button>
                {!shareResult && (
                    <Button type="button" onClick={handleCreateShare}>
                        Generate Link
                    </Button>
                )}
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
