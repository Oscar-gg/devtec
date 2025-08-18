import { profilePicture } from "~/utils/frontend/defaultProfilePicture";
import { cn } from "~/utils/frontend/classnames";
import { LinkWrapper } from "../LinkWrapper";

export const SummarizedCard = ({
  name,
  image,
  placeholder = "Organization",
  className,
  url,
}: {
  name: string | null | undefined;
  url?: string;
  image: string | null | undefined;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <LinkWrapper href={url}>
      <div
        className={cn(
          "flex items-center space-x-3",
          className,
          url && "group cursor-pointer",
        )}
      >
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">
          <img
            src={profilePicture({
              name,
              image,
            })}
            alt={name ?? placeholder}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="group-hover:text-devtec font-medium text-[#E0E0E0]">
            {name ?? placeholder}
          </p>
        </div>
      </div>
    </LinkWrapper>
  );
};
