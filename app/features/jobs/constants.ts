export const JOB_TYPES = [
    {
        label: "Full-Time",
        value: "full-time",
    },
    {
        label: "Part-Time",
        value: "part-time",
    },
    {
        label: "Remote",
        value: "remote",
    },
] as const;

export const LOCATION_TYPES = [
    {
        label: "On-Site",
        value: "on-site",
    },
    {
        label: "Remote",
        value: "remote",
    },
    {
        label: "Hybrid",
        value: "hybrid",
    }
] as const;

export const SALARY_RANGE = [
    "$0 - $ 50,000",
    "$50,000 - $75,000",
    "$75,000 - $100,000",
    "$100,000 - $125,000",
    "$125,000 - $150,000",
    "$150,000 - $200,000",
    "$200,000+"
] as const;