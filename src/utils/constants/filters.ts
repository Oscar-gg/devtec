export const orderOptions = ["asc", "desc"] as const;

export const sortByOptions = ["createdAt", "updatedAt", "stars"] as const;

export const formatSortByOptions = (option: string) => {
  switch (option) {
    case "createdAt":
      return "Created Date";
    case "updatedAt":
      return "Updated Date";
    case "stars":
      return "Stars";
    default:
      return option;
  }
};
