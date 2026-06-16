function Grid({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
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