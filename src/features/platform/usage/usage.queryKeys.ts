import { UsageQueryParams } from "./usage.params";

export const usageKeys = {
  all: ["usage"] as const,

  lists: () => [...usageKeys.all, "list"] as const,

  list: (params: UsageQueryParams) =>
    [...usageKeys.lists(), params] as const,
};
