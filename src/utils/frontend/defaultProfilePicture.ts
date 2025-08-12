export const defaultProfilePicture = (
  name: string | undefined | null,
): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name ?? "A"}`;
};
