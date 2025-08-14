import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { cn } from "~/utils/frontend/classnames";
export const OrderButton = ({
  order,
  setOrder,
  className,
  arrowClassName,
}: {
  order: "asc" | "desc";
  setOrder: (order: "asc" | "desc") => void;
  className?: string;
  arrowClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-1 hover:cursor-pointer hover:bg-[#2A2A2A]",
        className,
      )}
      onClick={() => {
        setOrder(order === "asc" ? "desc" : "asc");
      }}
    >
      {order === "asc" ? (
        <ArrowUpIcon
          className={cn("h-4 w-4 font-bold text-[#A0A0A0]", arrowClassName)}
        />
      ) : (
        <ArrowDownIcon
          className={cn("h-4 w-4 font-bold text-[#A0A0A0]", arrowClassName)}
        />
      )}
    </div>
  );
};
