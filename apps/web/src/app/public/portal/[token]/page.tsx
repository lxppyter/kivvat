"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { policy } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, User, Mail, AlertCircle, FileText, ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";

export default function PublicPortalPage() {
    const params = useParams();
    const token = params.token as string;
    
    const [portalData, setPortalData] = useState<any>(null); // { type, policies: [] }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({ name: "", email: "" });

    // View State
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
    const [signedPolicies, setSignedPolicies] = useState<string[]>([]);

    useEffect(() => {
        if(token) fetchPortal();
    }, [token]);

    const fetchPortal = async () => {
        try {
            const res = await policy.getPublic(token);
            if (res.data.type === 'PORTAL') {
                setPortalData(res.data);
            } else {
                // If it's a single policy, maybe redirect? Or just error for now.
                setError("This link is for a single policy. Please use the specific policy link.");
            }
        } catch (e: any) {
            setError(e.response?.data?.message || "Invalid or expired link");
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if(user.name && user.email) {
            setIsAuthenticated(true);
            // Ideally we check previous signatures here from backend, but for now we start fresh session
        }
    };

    const handleSign = async () => {
        if (!selectedPolicy) return;
        try {
             await policy.signPublic(token, { 
                 name: user.name, 
                 email: user.email, 
                 policyId: selectedPolicy.id 
             });
             
             toast.success("Policy Signed Successfully");
             setSignedPolicies(prev => [...prev, selectedPolicy.id]);
             setSelectedPolicy(null); // Return to list
        } catch (e) {
            toast.error("Failed to sign policy");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-slate-200 mb-4"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md border-red-200 shadow-lg">
                    <CardHeader className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <CardTitle className="text-red-600">Access Issue</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    // SCREEN 1: LOGIN
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-center text-xl">Company Compliance Portal</CardTitle>
                        <CardDescription className="text-center">
                            Please verify your identity to access and sign company policies.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        className="pl-9" placeholder="John Doe" required 
                                        value={user.name} onChange={e => setUser({...user, name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Work Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        type="email" className="pl-9" placeholder="john@company.com" required 
                                        value={user.email} onChange={e => setUser({...user, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full gap-2">
                                Access Portal <ArrowRight className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t bg-muted/20 py-4">
                        <p className="text-xs text-muted-foreground">Secure connection • 256-bit encryption</p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // SCREEN 2: READING POLICY
    if (selectedPolicy) {
        return (
             <div className="min-h-screen bg-slate-50 p-4 md:p-8">
                 <div className="max-w-4xl mx-auto h-[90vh] flex flex-col gap-4">
                     <Button variant="outline" className="w-fit" onClick={() => setSelectedPolicy(null)}>
                         ← Back to Policy List
                     </Button>
                     
                     <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
                        <CardHeader className="border-b bg-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{selectedPolicy.name}</CardTitle>
                                    <CardDescription>Version {selectedPolicy.version} • {selectedPolicy.category}</CardDescription>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <ScrollArea className="flex-1 p-6 bg-white/50">
                            <div className="prose prose-sm prose-slate max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                                    {selectedPolicy.content}
                                </pre>
                            </div>
                        </ScrollArea>
                        <CardFooter className="border-t bg-muted/10 p-6 flex justify-between items-center">
                            <p className="text-xs text-muted-foreground max-w-md">
                                By clicking "Sign & Accept", you acknowledge that you have read, understood, and agree to adhere to this policy.
                            </p>
                            <Button onClick={handleSign} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Sign & Accept
                            </Button>
                        </CardFooter>
                     </Card>
                 </div>
             </div>
        );
    }

    // SCREEN 3: LIST VIEW
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
             <div className="max-w-3xl mx-auto space-y-6">
                 <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border">
                     <div className="flex items-center gap-4">
                         <div className="bg-primary/10 p-3 rounded-lg">
                             <ShieldCheck className="h-8 w-8 text-primary" />
                         </div>
                         <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compliance Tasks</h1>
                            <p className="text-slate-500">Welcome, {user.name}</p>
                         </div>
                     </div>
                     <div className="text-right hidden sm:block">
                         <div className="text-2xl font-bold text-slate-900">
                             {signedPolicies.length} / {portalData.policies.length}
                         </div>
                         <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed</p>
                     </div>
                 </header>

                 <div className="grid gap-3">
                     {portalData.policies.map((p: any) => {
                         const isSigned = signedPolicies.includes(p.id);
                         return (
                             <Card key={p.id} className={`transition-all hover:shadow-md ${isSigned ? 'bg-emerald-50/50 border-emerald-100' : ''}`}>
                                 <div className="flex items-center p-4 gap-4">
                                     <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${isSigned ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                         {isSigned ? <CheckCircle2 className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                                     </div>
                                     <div className="flex-1">
                                         <h4 className={`font-semibold ${isSigned ? 'text-emerald-900' : 'text-slate-900'}`}>{p.name}</h4>
                                         <div className="flex items-center gap-2 mt-1">
                                             <Badge variant="outline" className="text-xs font-normal border-slate-200">{p.category}</Badge>
                                             <span className="text-xs text-muted-foreground">v{p.version}</span>
                                         </div>
                                     </div>
                                     <div>
                                         {isSigned ? (
                                             <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Signed</Badge>
                                         ) : (
                                             <Button size="sm" onClick={() => setSelectedPolicy(p)}>
                                                 Review & Sign
                                             </Button>
                                         )}
                                     </div>
                                 </div>
                             </Card>
                         );
                     })}
                 </div>

                 {signedPolicies.length === portalData.policies.length && (
                     <div className="mt-8 p-6 bg-emerald-600 text-white rounded-xl shadow-lg text-center animate-in fade-in slide-in-from-bottom-4">
                         <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-90" />
                         <h3 className="text-xl font-bold">All Policies Completed!</h3>
                         <p className="opacity-90 mt-2">You have successfully signed all required company policies. You may close this window.</p>
                     </div>
                 )}
             </div>
        </div>
    );
}
