import { cn } from "~/utils/frontend/classnames";
export const Button = ({
  children,
  className,
  ...props
}: Readonly<
  { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) => {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-lg bg-[#8B5CF6] px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-[#7C3AED] hover:shadow-lg hover:shadow-[#8B5CF6]/30",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
