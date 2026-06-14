import { ArrowRight, Cloud, Database, Zap, Globe, Package, Brain, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RevealCard } from "@/components/motion/RevealCard";
import { DotBackdrop } from "@/components/layout/Backgrounds";

/** Architecture stack component for video. */
interface StackLayer {
  name: string;
  components: string[];
  color: string;
  icon: React.ElementType;
}

const STACK: StackLayer[] = [
  {
    name: "AI & Intelligence Layer",
    components: [
      "Amazon Bedrock AgentCore",
      "Amazon Nova Pro (Multimodal Grading)",
      "Amazon Nova Pro (Reasoning & Decision)",
      "Amazon Nova Multimodal Embeddings (Buyer Matching)",
    ],
    color: "#FF9900",
    icon: Brain,
  },
  {
    name: "Event Processing & Orchestration",
    components: [
      "Amazon EventBridge (Return Event Streams)",
      "AWS Lambda (Serverless Functions)",
      "API Gateway (RESTful Endpoints)",
    ],
    color: "#00A8E1",
    icon: Zap,
  },
  {
    name: "Data & Storage Layer",
    components: [
      "Amazon S3 (Product Images & Assets)",
      "Amazon DynamoDB (Returns & Decisions)",
      "Amazon OpenSearch (Buyer & Comp Search)",
    ],
    color: "#146EB4",
    icon: Database,
  },
  {
    name: "Frontend & Experience",
    components: [
      "React + TypeScript (Cyra Console)",
      "Framer Motion (Animation Engine)",
      "Vite (Build Tool)",
      "Express Proxy (Dev Server)",
    ],
    color: "#2BB673",
    icon: Globe,
  },
];

export default function Architecture() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto max-w-7xl px-6 py-8">
      <DotBackdrop />

      {/* Header */}
      <div className="relative mb-8 text-center">
        <RevealCard index={0}>
          <div className="mb-3 flex items-center justify-center gap-2">
            <Cloud className="h-6 w-6 text-orange" />
            <Badge variant="orange">AWS-Powered</Badge>
          </div>
          <h2 className="text-[32px] font-bold text-white">
            Cyra Architecture
          </h2>
          <p className="mt-2 text-[15px] text-muted">
            Built on Amazon Bedrock, scales to Amazon's global returns volume
          </p>
        </RevealCard>
      </div>

      {/* Stack Layers */}
      <div className="relative space-y-5">
        {STACK.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <RevealCard key={layer.name} index={i + 1}>
              <div className="surface group relative overflow-hidden p-6 transition-all hover:shadow-glow">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: `${layer.color}20` }}
                />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-xl"
                      style={{ backgroundColor: `${layer.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: layer.color }} />
                    </div>
                    <h3 className="text-[18px] font-semibold text-white">
                      {layer.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {layer.components.map((component) => (
                      <div
                        key={component}
                        className="flex items-center gap-2 rounded-lg border border-slate/40 bg-ink/40 px-3 py-2.5"
                      >
                        <div
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-[13px] text-muted">{component}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealCard>
          );
        })}
      </div>

      {/* Data Flow Diagram */}
      <RevealCard index={5}>
        <div className="surface relative mt-6 overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <Network className="h-5 w-5 text-orange" />
              <p className="section-label !text-orange">Data flow</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-[13px]">
              <div className="rounded-lg border border-slate/50 bg-squid/80 px-4 py-2 font-semibold text-white">
                Return Event
              </div>
              <ArrowRight className="h-4 w-4 text-orange" />
              <div className="rounded-lg border border-orange/50 bg-orange/10 px-4 py-2 font-semibold text-orange">
                Nova Grading
              </div>
              <ArrowRight className="h-4 w-4 text-orange" />
              <div className="rounded-lg border border-orange/50 bg-orange/10 px-4 py-2 font-semibold text-orange">
                Nova Decision
              </div>
              <ArrowRight className="h-4 w-4 text-success" />
              <div className="rounded-lg border border-success/50 bg-success/10 px-4 py-2 font-semibold text-success">
                Second Life
              </div>
            </div>
            <p className="mt-4 text-center text-[12px] text-muted">
              Real-time pipeline: EventBridge → Lambda → Bedrock → DynamoDB → Frontend
            </p>
          </div>
        </div>
      </RevealCard>

      {/* Key Features */}
      <RevealCard index={6}>
        <div className="surface mt-6 p-6">
          <p className="section-label mb-4 text-center">Key capabilities</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-[24px] font-bold text-orange">Sub-5s</div>
              <p className="text-[12px] text-muted">Grade + route decision time</p>
            </div>
            <div className="border-l border-r border-slate/40 text-center">
              <div className="mb-2 text-[24px] font-bold text-success">99.9%</div>
              <p className="text-[12px] text-muted">Uptime SLA (serverless)</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-[24px] font-bold text-sky">∞</div>
              <p className="text-[12px] text-muted">Horizontal scale capacity</p>
            </div>
          </div>
        </div>
      </RevealCard>

      {/* CTA */}
      <RevealCard index={7}>
        <div className="mt-6 flex gap-3">
          <Button
            size="lg"
            variant="secondary"
            className="flex-1"
            onClick={() => navigate("/impact")}
          >
            View Impact Dashboard
          </Button>
          <Button
            size="lg"
            className="group flex-1"
            onClick={() => navigate("/inbox")}
          >
            Open Console
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </RevealCard>

      {/* Footer Note */}
      <p className="mt-6 text-center text-[11px] text-muted/50">
        Runs on AWS Free Tier • Scales to Amazon's global returns volume • Net-zero by 2040
      </p>
    </div>
  );
}
