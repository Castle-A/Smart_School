import { cn } from "../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

const Skeleton = ({
    className,
    variant = 'rectangular',
    width,
    height,
    ...props
}: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-white/10 rounded-lg",
                variant === 'circular' && "rounded-full",
                variant === 'text' && "rounded",
                className
            )}
            style={{
                width: width,
                height: height
            }}
            {...props}
        />
    );
};

export default Skeleton;
