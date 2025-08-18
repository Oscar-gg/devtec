export const projectCategories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Game Development",
  "Desktop Application",
  "API/Backend",
  "CLI",
  "Robotics",
  "Other",
];

export const defaultLanguage = "Other";
export const defaultCategory = "Other";

export const tagNames = [
  "External",
  "Help Wanted",
  "Tec Utility",
  "Tec21",
  "Beginner Friendly",
  "In Progress",
  "Completed",
  "Archived",
  "Tutorial",
  "Research",
  "Hackathon",
  "Business",
  "Portfolio",
];

export const getTagInfo = (tag: string) => {
  return (
    tagDisplayNames[tag] ?? {
      explanation: tag,
      color: "text-[#8B5CF6] bg-[#8B5CF6]/20",
    }
  );
};

export const tagDisplayNames: Record<
  string,
  { explanation: string; color: string }
> = {
  External: {
    explanation: "Implemented by someone else",
    color: "text-[#F87171] bg-[#F87171]/20",
  },
  "Help Wanted": {
    explanation: "Looking for Contributors",
    color: "text-[#22C55E] bg-[#22C55E]/20",
  },
  "Tec Utility": {
    explanation: "Tool related to Tec",
    color: "text-[#3B82F6] bg-[#3B82F6]/20",
  },
  Tec21: {
    explanation: "Related to Tec coursework",
    color: "text-[#A855F7] bg-[#A855F7]/20",
  },
  Business: {
    explanation: "Commercial or business-oriented project",
    color: "text-[#059669] bg-[#059669]/20",
  },
  Portfolio: {
    explanation: "Project for personal portfolio",
    color: "text-[#7C3AED] bg-[#7C3AED]/20",
  },

  "Beginner Friendly": {
    explanation: "Great for newcomers to contribute",
    color: "text-[#06B6D4] bg-[#06B6D4]/20",
  },

  "In Progress": {
    explanation: "Currently being developed",
    color: "text-[#F59E0B] bg-[#F59E0B]/20",
  },
  Completed: {
    explanation: "Project is finished",
    color: "text-[#059669] bg-[#059669]/20",
  },
  Archived: {
    explanation: "No longer maintained",
    color: "text-[#6B7280] bg-[#6B7280]/20",
  },

  Tutorial: {
    explanation: "Educational content",
    color: "text-[#8B5CF6] bg-[#8B5CF6]/20",
  },
  Research: {
    explanation: "Academic or research project",
    color: "text-[#EC4899] bg-[#EC4899]/20",
  },
  Hackathon: {
    explanation: "Created during a hackathon",
    color: "text-[#EF4444] bg-[#EF4444]/20",
  },
};
