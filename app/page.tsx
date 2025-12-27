import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Code, Zap } from "lucide-react";
import { getAllModules } from "@/lib/content/loaders";
import { getTotalLessons, getTotalEstimatedHours } from "@/lib/content/utils";
import { formatTime } from "@/lib/utils";
import { ModuleCard } from "@/components/course/ModuleCard";

export default function HomePage() {
  const modules = getAllModules();
  const totalLessons = getTotalLessons();
  const totalHours = getTotalEstimatedHours();

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "8 modules covering everything from fundamentals to production best practices",
    },
    {
      icon: Code,
      title: "Practical Examples",
      description: "Real-world code examples and exercises to reinforce learning",
    },
    {
      icon: Zap,
      title: "Production-Ready",
      description: "Learn patterns and pitfalls used in real AI engineering projects",
    },
  ];

  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Become an AI Engineer
          <br />
          <span className="text-primary">0 to 100</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A production-ready course for software engineers who want to master AI engineering.
          Learn LLMs, RAG, agents, evaluations, deployment, and more.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/learning-path">
            <Button size="lg" className="text-lg px-8">
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/toolbox">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Explore Toolbox
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{modules.length}</CardTitle>
            <CardDescription>Modules</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{totalLessons}</CardTitle>
            <CardDescription>Lessons</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{formatTime(totalHours * 60)}</CardTitle>
            <CardDescription>Estimated Learning Time</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why This Course?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx}>
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Modules Preview */}
      {modules.length > 0 && (
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Course Modules</h2>
            <Link href="/learning-path">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.slice(0, 6).map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

