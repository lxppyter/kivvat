"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { policy } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, ShieldCheck, User, Mail, AlertCircle } from "lucide-react";

export default function PublicPolicyPage() {
    const params = useParams();
    const token = params.token as string;
    
    const [policyData, setPolicyData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [signed, setSigned] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if(token) fetchPolicy();
    }, [token]);

    const fetchPolicy = async () => {
        try {
            const res = await policy.getPublic(token);
            setPolicyData(res.data);
        } catch (e: any) {
            setError(e.response?.data?.message || "Invalid or expired link");
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
             await policy.signPublic(token, { name, email });
             setSigned(true);
        } catch (e) {
            alert("Failed to submit signature. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-slate-200 mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
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
                        <CardTitle className="text-red-600">Access Denied</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (signed) {
        return (
             <div className="min-h-screen flex items-center justify-center bg-emerald-50/50 p-4">
                <Card className="w-full max-w-md border-emerald-200 shadow-lg animate-in zoom-in-95 duration-300">
                    <CardHeader className="text-center">
                        <div className="h-16 w-16 bg-emerald-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                        </div>
                        <CardTitle className="text-emerald-800 text-2xl">Successfully Signed</CardTitle>
                        <CardDescription className="text-emerald-600/80">
                            Thank you, {name}. Your acknowledgment has been recorded securely.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="bg-white/50 p-4 rounded-lg border border-emerald-100 text-sm">
                            <p className="font-semibold text-emerald-900">{policyData.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">Version {policyData.version}</p>
                            <p className="text-xs text-muted-foreground mt-1">Signed at {new Date().toLocaleString()}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-xs text-muted-foreground">You can close this page now.</p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex items-center gap-3 mb-8">
                     <ShieldCheck className="h-8 w-8 text-primary" />
                     <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compliance Portal</h1>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* LEFT: Policy Content (2/3 width) */}
                    <div className="md:col-span-2">
                        <Card className="h-[80vh] flex flex-col shadow-md">
                            <CardHeader className="border-b bg-card">
                                <CardTitle>{policyData.name}</CardTitle>
                                <CardDescription>
                                    Please read this document carefully before signing.
                                    <span className="block mt-1 text-xs bg-muted inline-block px-2 py-1 rounded">Version {policyData.version}</span>
                                </CardDescription>
                            </CardHeader>
                            <ScrollArea className="flex-1 p-6 bg-white/50">
                                <div className="prose prose-sm prose-slate max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700">
                                        {policyData.content}
                                    </pre>
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>

                    {/* RIGHT: Sign Form (1/3 width) */}
                    <div>
                        <Card className="shadow-md sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg">Digital Signature</CardTitle>
                                <CardDescription>
                                    I acknowledge that I have read and understood this policy.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSign} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="name" 
                                                placeholder="John Doe" 
                                                className="pl-9" 
                                                required 
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                placeholder="john@company.com" 
                                                className="pl-9" 
                                                required 
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <div className="flex items-start gap-2 mb-4">
                                            <input type="checkbox" id="agree" required className="mt-1" />
                                            <label htmlFor="agree" className="text-xs text-muted-foreground leading-tight">
                                                By clicking "Sign Policy", I agree to be bound by the terms set forth in this document and certify that the information provided is accurate.
                                            </label>
                                        </div>
                                        
                                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
                                            {submitting ? "Signing..." : "Sign Policy"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
