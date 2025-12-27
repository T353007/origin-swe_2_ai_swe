import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, Rocket, BookOpen } from "lucide-react";

const sections = [
  {
    icon: Building2,
    title: "Building Your Brand",
    description: "Establish yourself as a serious AI engineer in your network",
    content: [
      "Share your learnings and projects on LinkedIn, Twitter, and technical blogs",
      "Contribute to open-source AI projects to demonstrate your skills",
      "Speak at meetups or conferences about AI engineering topics",
      "Write technical articles about AI patterns, pitfalls, and solutions",
      "Engage with the AI engineering community on forums and Discord",
      "Build a portfolio of AI projects that solve real problems",
    ],
  },
  {
    icon: TrendingUp,
    title: "Leveling Up as an AI-First Engineer",
    description: "Develop the skills that distinguish AI engineers from traditional software engineers",
    content: [
      "Master prompt engineering and understand token economics",
      "Learn to evaluate AI systems systematically (unit tests, integration tests, eval frameworks)",
      "Understand the full AI lifecycle: data preparation → model selection → deployment → monitoring",
      "Develop expertise in AI infrastructure: vector DBs, GPU orchestration, model serving",
      "Learn to debug AI systems: tracing, logging, and observability for LLM applications",
      "Understand cost optimization: token usage, caching, model selection strategies",
      "Master production patterns: RAG, agents, tool calling, streaming",
    ],
  },
  {
    icon: Rocket,
    title: "Building Your Own AI Coding Agent",
    description: "The ultimate capstone project for demonstrating AI engineering skills",
    content: [
      "Start with a simple CLI tool that uses LLMs to generate code",
      "Add context management: understand your codebase structure",
      "Implement tool calling: let the agent read files, run commands, write code",
      "Add planning capabilities: break down complex tasks into steps",
      "Implement error handling and recovery mechanisms",
      "Add evaluation: test the agent's code generation quality",
      "Deploy as a VS Code extension or CLI tool",
      "Open source it and gather feedback from the community",
      "This project demonstrates: LLMs, tool calling, agents, RAG (codebase search), evals, deployment",
    ],
  },
  {
    icon: BookOpen,
    title: "Staying Current",
    description: "Keep up with the rapidly evolving AI engineering landscape",
    content: [
      "Follow key researchers and engineers on Twitter/X",
      "Subscribe to AI engineering newsletters (The Batch, AI News, etc.)",
      "Join AI engineering communities (Discord servers, Slack workspaces)",
      "Attend AI conferences (NeurIPS, ICML, or engineering-focused events)",
      "Experiment with new tools and frameworks as they emerge",
      "Read papers on practical AI topics (RAG improvements, evaluation methods, agent architectures)",
      "Follow GitHub trending repositories for AI tools",
      "Build side projects to test new techniques",
      "Contribute to AI open-source projects to learn from experts",
    ],
  },
];

export default function CareerPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Engineering Career Path</h1>
          <p className="text-xl text-muted-foreground">
            Build your brand, level up your skills, and stay current in the AI engineering field
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <section.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-2xl mb-2">{section.title}</CardTitle>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

