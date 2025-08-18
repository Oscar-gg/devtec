import { SummarizedCard } from "~/app/_components/card/SummarizedCard";
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
          <SummarizedCard
            key={org.id}
            image={org.logo}
            name={org.name}
            placeholder="organization"
            url={`/organizations/${org.id}`}
            className="flex items-center space-x-3 rounded-lg border border-gray-600 bg-[#2A2A2A] p-4 transition-colors hover:bg-[#333333]"
          />
        ))}
      </div>
    </div>
  );
}
