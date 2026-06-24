import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom design-token scales (defined as theme
// variables in index.css). Without this it can't tell that two of our tokens —
// or one of ours vs a built-in — are competing values of the same property, so
// it keeps both and the element ends up with two conflicting rules. Registering
// them on the matching theme keys lets a caller's `className` correctly override
// a component's default for size, spacing, and radius.
const spacing = [
    "xxxsm", "xxsm", "xsm", "sm", "md",
    "bg", "xbg", "xxbg", "xxxbg",
    "lg", "xlg", "xxlg", "xxxlg",
    "hg", "xhg", "xxhg", "xxxhg",
]; // --spacing-* : drives p-*, m-*, gap-*, w-*, h-*, inset-*, …
const text = ["display", "h1", "h2", "h3", "h4", "h5", "h6", "lead"]; // --text-* font sizes
const radius = ["sm", "md", "bg", "card", "round"]; // --radius-* (sm/md overlap built-ins)

const twMerge = extendTailwindMerge({
    extend: {
        theme: { spacing, text, radius },
    },
});

export function cn(...classes: Array<string | false | null | undefined>) {
    // return classes.filter(Boolean).join(" ");
    return twMerge(classes)
}
