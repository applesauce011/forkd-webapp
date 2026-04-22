import { cn } from "@/lib/utils/cn";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageWrapper({ children, className, narrow = false }: PageWrapperProps) {
  return (
    <div className={cn(
      "w-full mx-auto px-4 py-6",
      narrow ? "max-w-2xl" : "max-w-3xl",
      className
    )}>
      {children}
    </div>
  );
}
