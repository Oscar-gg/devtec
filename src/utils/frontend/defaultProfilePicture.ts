export const defaultProfilePicture = (
  name: string | undefined | null,
): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${name ?? "A"}`;
};

export const profilePicture = ({
  image,
  name,
}: {
  image: string | undefined | null;
  name: string | undefined | null;
}) => {
  if (image) return image;
  return defaultProfilePicture(name);
};
