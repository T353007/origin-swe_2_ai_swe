import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getToolboxItem(slug: string) {
  const filePath = path.join(process.cwd(), "content/toolbox", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...(data as any),
    content,
  };
}

const mdxComponents = {
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="mb-4 leading-7" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground rounded-lg p-4 overflow-x-auto mb-4" {...props} />
  ),
  a: (props: any) => (
    <a className="text-primary underline hover:text-primary/80" {...props} />
  ),
};

export default async function ToolboxItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getToolboxItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="container py-12">
      <Link href="/toolbox">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Toolbox
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <Badge className="mb-4">{item.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{item.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <a href={item.officialUrl} target="_blank" rel="noopener noreferrer">
                <Button>
                  Visit Official Site
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={item.content} components={mdxComponents} />
          </div>

          {item.whenToUse && item.whenToUse.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>When to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.whenToUse.map((use: string, idx: number) => (
                    <li key={idx}>• {use}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {item.alternatives && item.alternatives.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Alternatives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.alternatives.map((alt: string, idx: number) => (
                    <li key={idx}>• {alt}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </article>
      </div>
    </div>
  );
}

