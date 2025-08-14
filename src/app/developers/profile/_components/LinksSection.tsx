import { type RouterOutputs } from "~/trpc/react";

type UserLinks = RouterOutputs["user"]["getPublicProfile"]["UserLink"];

export function LinksSection({ links }: { links: UserLinks }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">Links</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 rounded-lg border border-gray-600 bg-[#2A2A2A] p-3 transition-colors hover:border-[#8B5CF6] hover:bg-[#333333]"
          >
            {link.linkType.logo && (
              <div className="relative h-6 w-6 flex-shrink-0">
                <img
                  src={link.linkType.logo}
                  alt={link.linkType.name}
                  className="object-contain"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{link.linkType.name}</p>
              <p className="truncate text-sm text-gray-400">{link.url}</p>
            </div>
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
