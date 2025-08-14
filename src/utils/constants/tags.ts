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

export const tagNames = ["External", "Help Wanted", "Tec Utility"];

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
};
