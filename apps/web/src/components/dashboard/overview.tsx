"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export function DashboardOverview() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
      
      gsap.from(".content-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Hero / Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Security Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time compliance monitoring and risk assessment.
          </p>
        </div>
        <Button variant="neon">
          Run New Scan
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Score
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Passing Checks
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              12 new passed
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Riscs
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Tasks
            </CardTitle>
            <ArrowRight className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 assigned to you
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Evidence */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 content-section">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest compliance checks and automated actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "S3 Public Access", status: "Failed", time: "2 min ago", desc: "Bucket 'kivvat-logs' is public" },
                { name: "MFA Check", status: "Passed", time: "15 min ago", desc: "Root account MFA enabled" },
                { name: "Port 22 SSH", status: "Passed", time: "1 hour ago", desc: "No open SSH ports found" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${item.status === 'Passed' ? 'bg-green-500' : 'bg-destructive'}`} />
                    <div>
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Compliance Standards</CardTitle>
            <CardDescription>
              Progress by framework.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "ISO 27001", progress: 78, color: "bg-primary" },
                { name: "GDPR", progress: 92, color: "bg-green-500" },
                { name: "SOC 2", progress: 45, color: "bg-orange-500" },
              ].map((std) => (
                <div key={std.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{std.name}</span>
                    <span className="text-muted-foreground">{std.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary/20">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${std.color}`}
                      style={{ width: `${std.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
