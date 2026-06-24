import { cn } from "../../utils/cn";

function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn('grid items-center gap-xlg grid-cols-2', className)}>
            {children}
        </div>
    )
}

function Column({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export const Layout = { Grid, Column, Row }