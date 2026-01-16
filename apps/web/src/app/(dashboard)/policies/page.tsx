"use client";

import { useEffect, useState } from "react";
import { compliance } from "@/lib/api";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, FileText, Lock, AlertTriangle, CheckCircle2, Download, Cloud, Users, Mail } from "lucide-react";

interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  status?: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
}

interface Standard {
  id: string;
  name: string;
  description: string;
  complianceScore: number;
  controls: Control[];
}

export default function PoliciesPage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignmentStats, setAssignmentStats] = useState<any>({ total: 0, signed: 0, pending: 0, overdue: 0, percentage: 0 });
  
  // For Employee View
  const [myAssignments, setMyAssignments] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<{ id: string; name: string; content: string } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Need to get current user to fetch THEIR assignments.
            // For this demo, we can just fetch *all* assignments where userId matches "me" (handled by backend or filtered here).
            // Actually, backend needs `userId`. getAssignments(userId)
            
            // First get profile
            const { auth } = await import("@/lib/api");
            // If auth is not working fully yet, we might need a fallback.
            let profileId;
            try {
                const profileRes = await auth.getProfile();
                profileId = profileRes.data.id;
            } catch (e) {
                // If 401, maybe just show empty myAssignments or a mock one for demo steps if needed.
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
    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
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
            <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="dashboard">Gap Analysis Dashboard</TabsTrigger>
                <TabsTrigger value="documents">Document Library ({templates.length})</TabsTrigger>
                <TabsTrigger value="signatures">Signatures & Status</TabsTrigger>
                <TabsTrigger value="controls">All Controls ({standards.reduce((acc, s) => acc + s.controls.length, 0)})</TabsTrigger>
            </TabsList>

            {/* DASHBOARD TAB */}
            <TabsContent value="dashboard" className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {standards.length > 0 ? Math.round(standards.reduce((acc, s) => acc + s.complianceScore, 0) / standards.length) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">Across all standards</p>
                            <Progress value={standards.length > 0 ? Math.round(standards.reduce((acc, s) => acc + s.complianceScore, 0) / standards.length) : 0} className="mt-3 h-2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {standards.reduce((acc, s) => acc + s.controls.filter(c => c.status === 'NON_COMPLIANT' || c.status === 'PENDING').length, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">High priority issues</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Auto-Verified</CardTitle>
                            <Cloud className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {standards.reduce((acc, s) => acc + s.controls.filter(c => c.status === 'COMPLIANT').length, 0)}
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
                    <CardHeader>
                        <CardTitle>Required Policy Documents</CardTitle>
                        <CardDescription>
                            Download standard templates, fill them out, and upload them to satisfy administrative controls.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                         <div className="divide-y divide-border/50">
                            {templates.map((tmpl, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{tmpl.name}</h4>
                                            <p className="text-xs text-muted-foreground">Category: {tmpl.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                                            available
                                        </Badge>
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="gap-2"
                                            onClick={async () => {
                                                try {
                                                    const { policy } = await import("@/lib/api");
                                                    const res = await policy.download(tmpl.id, "Demo Company Ltd.");
                                                    alert(`Downloaded Template:\n\n${res.data.name}\n\nContent Preview:\n${res.data.content.substring(0, 100)}...`);
                                                } catch (e) {
                                                    alert("Failed to download template");
                                                }
                                            }}
                                        >
                                            <Download className="h-3 w-3" /> Template
                                        </Button>
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
                        <Button size="sm">
                            <Mail className="h-4 w-4 mr-2" /> Send Reminders
                        </Button>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {assignments.map((assignment, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {assignment.user.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{assignment.user.name}</h4>
                                            <p className="text-xs text-muted-foreground text-ellipsis max-w-xs overflow-hidden whitespace-nowrap" title={assignment.policy.name}>
                                                {assignment.policy.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {assignment.signedAt ? new Date(assignment.signedAt).toLocaleDateString() : '-'}
                                        </span>
                                        {assignment.status === 'SIGNED' && <Badge className="bg-emerald-500">Signed</Badge>}
                                        {assignment.status === 'PENDING' && <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>}
                                        {assignment.status === 'OVERDUE' && <Badge variant="destructive">Overdue</Badge>}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>

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
                    <DialogFooter className="flex items-center justify-between sm:justify-between w-full mt-4">
                        <span className="text-xs text-muted-foreground">
                            By clicking "I Agree", you digitally sign this document with timestamp.
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setSelectedPolicy(null)}>Cancel</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={async () => {
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
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CONTROLS LIST TAB (Original View) */}
            <TabsContent value="controls">
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
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-4 pt-1 pl-24 pr-4">
                                            <p className="text-sm text-muted-foreground mb-4">{control.description}</p>
                                            
                                            {/* EVIDENCE HISTORY */}
                                            <div className="border-t border-border/50 pt-4">
                                                 <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Audit Trail & Evidence</h4>
                                                 <div className="space-y-2">
                                                     <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={async (e) => {
                                                         // Prevent accordion toggle if needed, or just let it be
                                                         // Ideally we would fetch history here on demand
                                                         // For now, let's open a new window to the evidence report of the LATEST scan if available
                                                         // Or show a list. Let's make it a list in a Dialog for now, or just a direct link to report if we had scan ID.
                                                         
                                                         // Simpler: Just fetch history and alert for now to verify backend, then build UI
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
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
