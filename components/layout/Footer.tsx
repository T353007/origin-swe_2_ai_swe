import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Course</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/learning-path" className="hover:text-foreground">
                  Learning Path
                </Link>
              </li>
              <li>
                <Link href="/toolbox" className="hover:text-foreground">
                  Toolbox
                </Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-foreground">
                  Career
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/progress" className="hover:text-foreground">
                  Progress
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-foreground">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to become an AI engineer from 0 to 100. Production-ready
              course content for software engineers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Engineering Course. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

