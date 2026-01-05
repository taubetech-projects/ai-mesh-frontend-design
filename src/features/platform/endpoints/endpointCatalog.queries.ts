import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { endpointCatalogService } from "./endpointCatalog.service";
import { endpointCatalogKeys } from "./endpointCatalog.queryKeys";
import {
  EndpointCreateRequest,
  EndpointUpdateRequest,
} from "./endpoint.types";


export function useEndpoints() {
  return useQuery({
    queryKey: endpointCatalogKeys.list(),
    queryFn: endpointCatalogService.list,
  });
}


export function useEndpoint(id: string, enabled = true) {
  return useQuery({
    queryKey: endpointCatalogKeys.detail(id),
    queryFn: () => endpointCatalogService.get(id),
    enabled: !!id && enabled,
  });
}


export function useCreateEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EndpointCreateRequest) =>
      endpointCatalogService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: endpointCatalogKeys.all,
      });
    },
  });
}


export function useUpdateEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: EndpointUpdateRequest;
    }) =>
      endpointCatalogService.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: endpointCatalogKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: endpointCatalogKeys.list(),
      });
    },
  });
}


export function useDeleteEndpoint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      endpointCatalogService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: endpointCatalogKeys.all,
      });
    },
  });
}
