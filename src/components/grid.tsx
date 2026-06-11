import { cn } from "../utils/cn";
import { cv } from "../utils/cv";

type GridProps = {
    children: React.ReactNode;
    className?: string;
};

const gridVariants = cv({
    base: ["grid"],
    variants: {
        variant: {
            default: ["container"],
            fill: ["grid-cols-[repeat(auto-fill,minmax(var(--width),1fr))]"],
            fit: ["grid-cols-[repeat(auto-fit,minmax(var(--width),1fr))]"],
            fixed: ["grid-cols-[repeat(var(--columns-count),minmax(0,1fr))]"],
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

function DefaultGrid({ children, className }: GridProps) {
    return (
        <div className={cn(gridVariants({ variant: "default" }), className)}>
            {children}
        </div>
    )
}

function FixedGrid({ children, className }: GridProps) {
    return (
        <div className={cn(gridVariants({ variant: "fixed" }), className)}>
            {children}
        </div>
    )
}

function AutoFitGrid({ children, className }: GridProps) {
    return (
        <div className={cn(gridVariants({ variant: "fit" }), className)}>
            {children}
        </div>
    )
}

function AutoFillGrid({ children, className }: GridProps) {
    return (
        <div className={cn(gridVariants({ variant: "fill" }), className)}>
            {children}
        </div>
    )
}

export const Grid = Object.assign(DefaultGrid, {
    Fixed: FixedGrid,
    AutoFit: AutoFitGrid,
    AutoFill: AutoFillGrid,
});