"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";

interface LogLine {
  text: string;
  type: "command" | "info" | "success" | "warning" | "error";
  id: number;
}

const commands = [
  { text: "kivvat scan --target aws-prod", delay: 80 },
  { text: "Initializing agentless scanner...", delay: 400, type: "info" },
  { text: "Connecting to AWS us-east-1 region...", delay: 300, type: "info" },
  { text: "Verifying IAM roles...", delay: 600, type: "success" },
  { text: "Checking S3 bucket policies...", delay: 400, type: "info" },
  { text: "WARNING: Public access detected on 'financial-reports-2024'", delay: 500, type: "warning" },
  { text: "Auto-remediating issue...", delay: 800, type: "info" },
  { text: "Success: Bucket permissions locked.", delay: 300, type: "success" },
  { text: "Scanning EC2 security groups...", delay: 400, type: "info" },
  { text: "No open ports found (0.0.0.0/0).", delay: 300, type: "success" },
  { text: "Generating compliance report (SOC2 Type II)...", delay: 1000, type: "info" },
  { text: "Scan complete. Score: 100/100", delay: 200, type: "success" },
];

export function AsciiTerminal() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const processCommand = async () => {
      if (currentCommandIndex >= commands.length) {
        // Reset after delay
        timeout = setTimeout(() => {
            setLines([]);
            setCurrentCommandIndex(0);
            setIsTyping(true);
        }, 5000);
        return;
      }

      const cmd = commands[currentCommandIndex];

      if (cmd.type === undefined) {
          // It's a typed command
          if (currentText.length < cmd.text.length) {
              timeout = setTimeout(() => {
                  setCurrentText(cmd.text.slice(0, currentText.length + 1));
              }, Math.random() * 50 + 30); // Typing speed variance
          } else {
              // Finished typing
              setLines(prev => [...prev, { text: "> " + cmd.text, type: "command", id: Date.now() }]);
              setCurrentText("");
              setCurrentCommandIndex(prev => prev + 1);
          }
      } else {
          // It's an output log
          timeout = setTimeout(() => {
              setLines(prev => [...prev, { text: cmd.text, type: cmd.type as any, id: Date.now() }]);
              setCurrentCommandIndex(prev => prev + 1);
          }, cmd.delay);
      }
    };

    processCommand();

    return () => clearTimeout(timeout);
  }, [currentCommandIndex, currentText]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0b0b0b] border border-[#333] rounded-lg overflow-hidden shadow-2xl font-mono text-sm relative group">
        
        {/* Terminal Header */}
        <div className="bg-[#1a1a1a] px-4 py-2 border-b border-[#333] flex items-center justify-between">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                kivvat_cli — -zsh — 80x24
            </div>
        </div>

        {/* Terminal Body */}
        <div ref={scrollRef} className="h-[400px] p-6 text-neutral-300 overflow-y-auto custom-scrollbar">
            {lines.map((line) => (
                <div key={line.id} className="mb-2 break-all">
                    {line.type === 'command' && (
                        <span className="text-neutral-500 mr-2">$</span>
                    )}
                    <span className={`
                        ${line.type === 'command' ? 'text-white font-bold' : ''}
                        ${line.type === 'success' ? 'text-emerald-400' : ''}
                        ${line.type === 'warning' ? 'text-amber-400' : ''}
                        ${line.type === 'info' ? 'text-neutral-300' : ''}
                    `}>
                        {line.text}
                    </span>
                </div>
            ))}
            
            {/* Active Typing Line */}
            {currentCommandIndex < commands.length && commands[currentCommandIndex].type === undefined && (
                 <div className="mt-2 text-white">
                    <span className="text-neutral-500 mr-2">$</span>
                    {currentText}
                    <span className="animate-pulse inline-block w-2 h-4 bg-primary align-middle ml-1" />
                 </div>
            )}
            
            {/* Idle Cursor */}
            {currentCommandIndex >= commands.length && (
                <div className="mt-2 text-white">
                    <span className="text-neutral-500 mr-2">$</span>
                    <span className="animate-pulse inline-block w-2 h-4 bg-primary align-middle ml-1" />
                </div>
            )}

        </div>

        {/* Scanline Effect (Optional) */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20" />
    </div>
  );
}
