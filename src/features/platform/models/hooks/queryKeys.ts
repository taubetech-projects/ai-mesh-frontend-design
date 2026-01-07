export const modelCatalogKeys = {
  all: ["model-catalog"] as const,

  list: () => [...modelCatalogKeys.all, "list"] as const,

  detail: (id: string) =>
    [...modelCatalogKeys.all, "detail", id] as const,
};
