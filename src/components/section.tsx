import { cn } from "../utils/cn";
import { cv } from "../utils/cv";

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';

type SectionProps = {
    children: React.ReactNode;
    paddingTop?: PaddingSize;
    paddingBottom?: PaddingSize;
};

const sectionVariants = cv({
    base: ["mx-auto"],
    variants: {
        variant: {
            basic: ["container"],
            full: ["w-full"],
        },
        paddingTop: {
            none: ["pt-0"],
            sm: ["pt-16"],
            md: ["pt-24"],
            lg: ["pt-32"],
        },
        paddingBottom: {
            none: ["pb-0"],
            sm: ["pb-16"],
            md: ["pb-24"],
            lg: ["pb-32"],
        },
    },
    defaultVariants: {
        variant: "basic",
        paddingTop: "md",
        paddingBottom: "md",
    },
});

function BasicSection({ children, paddingTop, paddingBottom }: SectionProps) {
    return (
        <section className="relative">
            <div className={cn(sectionVariants({ variant: "basic", paddingTop, paddingBottom }))}>
                {children}
            </div>
        </section>
    )
}

function FullSection({ children, paddingTop, paddingBottom }: SectionProps) {
    return (
        <section className="relative">
            <div className={cn(sectionVariants({ variant: "full", paddingTop, paddingBottom }))}>
                {children}
            </div>
        </section>
    )
}

export const Section = Object.assign(BasicSection, {
    Full: FullSection,
});
