import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:auto-rows-[25rem] md:grid-cols-3 px-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  layoutType = 'default'
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  layoutType?: 'default' | 'header-left' | 'header-right';
}) => {
  const isSideBySide = layoutType !== 'default';

  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        isSideBySide ? 'flex-col md:flex-row md:space-y-0 md:space-x-4' : 'flex-col',
        "aspect-square md:aspect-auto",
        className,
      )}
    >
      {isSideBySide ? (
        // Side-by-side layout for header-left and header-right
        <>
          {layoutType === 'header-right' && (
            <div className="w-full md:w-1/2 transition duration-200 group-hover/bento:translate-x-2 flex flex-col justify-center">
              {icon}
              <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
                {title}
              </div>
              <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
                {description}
              </div>
            </div>
          )}

          <div className="w-full md:w-1/2 h-full">
            {header}
          </div>

          {layoutType !== 'header-right' && ( // This will render for header-left
            <div className="w-full md:w-1/2 transition duration-200 group-hover/bento:translate-x-2 flex flex-col justify-center">
              {icon}
              <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
                {title}
              </div>
              <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
                {description}
              </div>
            </div>
          )}
        </>
      ) : (
        // Default stacked layout - Reverted to original structure without fragment
        <>
          {header}
          <div className="transition duration-200 group-hover/bento:translate-x-2">
            {icon}
            <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
              {title}
            </div>
            <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
              {description}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
