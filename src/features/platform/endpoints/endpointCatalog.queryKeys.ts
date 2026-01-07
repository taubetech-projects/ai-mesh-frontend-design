export const endpointCatalogKeys = {
  all: ["endpoint-catalog"] as const,

  list: () =>
    [...endpointCatalogKeys.all, "list"] as const,

  detail: (id: string) =>
    [...endpointCatalogKeys.all, "detail", id] as const,
};
