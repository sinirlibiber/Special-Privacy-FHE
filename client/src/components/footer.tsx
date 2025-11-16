import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card/30 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2024 Special Privacy FHE. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Privacy-preserving governance powered by Zama FHE
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Built by</span>
            <a
              href="https://github.com/sinirlibiber"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md px-3 py-2"
              data-testid="link-github-builder"
            >
              <Github className="h-4 w-4" />
              sinirlibiber
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
