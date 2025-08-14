import { type RouterOutputs } from "~/trpc/react";

type WorkExperience = RouterOutputs["user"]["getProfile"]["workExperience"];

interface WorkExperienceSectionProps {
  workExperience: WorkExperience;
}

export function WorkExperienceSection({
  workExperience,
}: WorkExperienceSectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-[#1E1E1E] p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">Work Experience</h3>
      <div className="space-y-4">
        {workExperience.map((experience) => (
          <div key={experience.id} className="border-l-2 border-[#8B5CF6] pl-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-white">
                  {experience.position}
                </h4>
                <p className="text-[#8B5CF6]">{experience.company.name}</p>
                {experience.location && (
                  <p className="text-sm text-gray-400">{experience.location}</p>
                )}
              </div>
              <div className="text-right text-sm text-gray-400">
                <p>
                  {formatDate(experience.startDate)} -{" "}
                  {experience.endDate
                    ? formatDate(experience.endDate)
                    : "Present"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
