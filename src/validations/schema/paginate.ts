import { z } from "zod";

export const SortRule = z.enum(["asc", "desc", 'az', 'za']).default("asc")
export const PageRule = z.number().min(1).default(1)
export const LimitRule = z.number().min(1).max(100).default(10)

export const Paginate = z.object({
    sort: SortRule,
    page: PageRule,
    limit: LimitRule,
})
