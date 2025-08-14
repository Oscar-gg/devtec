import { type RouterOutputs } from "~/trpc/react";

type Organizations = RouterOutputs["user"]["getPublicProfile"]["organizations"];

export function OrganizationsSection({
  organizations,
}: {
  organizations: Organizations;
}) {
  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">Organizations</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="flex items-center space-x-3 rounded-lg border border-gray-600 bg-[#2A2A2A] p-4 transition-colors hover:bg-[#333333]"
          >
            {org.logo && (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                <img src={org.logo} alt={org.name} className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-white">{org.name}</h4>
              {org.description && (
                <p className="line-clamp-2 text-sm text-gray-400">
                  {org.description}
                </p>
              )}
              {org.url && (
                <a
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#8B5CF6] hover:underline"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
