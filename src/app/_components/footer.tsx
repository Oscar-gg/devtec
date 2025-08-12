import { GitHubIcon } from "~/app/_components/icons";
import { cn } from "~/utils/frontend/classnames";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "mt-16 border-t border-gray-800 bg-[#1E1E1E] py-8",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-[#A0A0A0]">
            © 2025 DevTec. Discover projects, developers, and organizations
            related to the Tec community.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <a
              href="https://github.com/Oscar-gg/devtec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A0A0A0] transition-colors duration-200 hover:text-[#8B5CF6]"
              aria-label="View on GitHub"
            >
              <GitHubIcon className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/Oscar-gg/devtec/blob/main/CONTRIBUTING.md"
              className="text-[#A0A0A0] transition-colors duration-200 hover:text-[#3B82F6]"
            >
              Contribute
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
