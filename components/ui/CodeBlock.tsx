"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  children: React.ReactElement;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { theme, systemTheme } = useTheme();
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const highlight = async () => {
      try {
        // Extract code content from the code element
        // children is the code element, and children.props.children is the code content
        let codeString = "";
        if (typeof children === "object" && children.props) {
          const codeContent = children.props.children;
          codeString = typeof codeContent === "string" 
            ? codeContent 
            : Array.isArray(codeContent)
            ? codeContent.map((c: any) => typeof c === "string" ? c : String(c)).join("")
            : String(codeContent);
        } else {
          codeString = String(children);
        }
        
        // Extract language from className of the code element
        const codeClassName = (children as any)?.props?.className || "";
        const languageMatch = codeClassName.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : "text";
        
        // Normalize language names
        let normalizedLanguage = language;
        if (language === "env" || language === "dotenv") {
          normalizedLanguage = "properties";
        }

        const themeName = effectiveTheme === "dark" ? "github-dark" : "github-light";
        
        const html = await codeToHtml(codeString.trim(), {
          lang: normalizedLanguage,
          theme: themeName,
        });

        setHighlightedCode(html);
        setIsLoading(false);
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain text
        let codeString = "";
        if (typeof children === "object" && children.props) {
          const codeContent = children.props.children;
          codeString = typeof codeContent === "string" 
            ? codeContent 
            : String(codeContent);
        } else {
          codeString = String(children);
        }
        setHighlightedCode(`<pre><code>${codeString}</code></pre>`);
        setIsLoading(false);
      }
    };

    highlight();
  }, [children, effectiveTheme]);

  if (isLoading) {
    let codeString = "";
    if (typeof children === "object" && children.props) {
      const codeContent = children.props.children;
      codeString = typeof codeContent === "string" 
        ? codeContent 
        : String(codeContent);
    } else {
      codeString = String(children);
    }
    return (
      <pre className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground rounded-lg p-4 overflow-x-auto mb-4">
        <code>{codeString}</code>
      </pre>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden mb-4 [&_pre]:!m-0 [&_pre]:!p-4 [&_pre]:!overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}

