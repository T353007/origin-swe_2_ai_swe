import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ToolboxItem } from "@/types/content";
import { ExternalLink } from "@/components/toolbox/ExternalLink";

const categories = [
  { id: "agents", label: "Agents", description: "AI agent frameworks and patterns" },
  { id: "rag", label: "RAG", description: "Retrieval-Augmented Generation tools" },
  { id: "evals", label: "Evaluations", description: "Evaluation frameworks and tools" },
  { id: "observability", label: "Observability", description: "Tracing and monitoring tools" },
  { id: "vector-db", label: "Vector Databases", description: "Vector database solutions" },
  { id: "prompt-mgmt", label: "Prompt Management", description: "Prompt versioning and management" },
  { id: "guardrails", label: "Guardrails", description: "Safety and content moderation" },
  { id: "fine-tuning", label: "Fine-tuning", description: "Model fine-tuning tools" },
  { id: "data-pipelines", label: "Data Pipelines", description: "ETL and data preparation" },
  { id: "ci-cd", label: "CI/CD", description: "Continuous integration for AI" },
];

function getToolboxItems(): ToolboxItem[] {
  const toolboxDir = path.join(process.cwd(), "content/toolbox");
  if (!fs.existsSync(toolboxDir)) {
    return [];
  }

  const files = fs.readdirSync(toolboxDir).filter((file) => file.endsWith(".mdx"));
  
  return files.map((file) => {
    const filePath = path.join(toolboxDir, file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    
    return {
      ...(data as Omit<ToolboxItem, "content">),
      id: file.replace(".mdx", ""),
      content,
    };
  });
}

export default function ToolboxPage() {
  const items = getToolboxItems();
  const itemsByCategory = categories.map((category) => ({
    ...category,
    items: items.filter((item) => item.category === category.id),
  }));

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Engineering Toolbox</h1>
          <p className="text-xl text-muted-foreground">
            Essential tools and patterns for building production AI systems
          </p>
        </div>

        <div className="space-y-12">
          {itemsByCategory.map((category) => {
            if (category.items.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{category.label}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <Link key={item.id} href={`/toolbox/${item.id}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <ExternalLink
                            href={item.officialUrl}
                            className="text-sm text-primary hover:underline"
                          >
                            Official Site →
                          </ExternalLink>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

