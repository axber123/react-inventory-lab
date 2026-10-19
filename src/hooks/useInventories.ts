import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adjustInventory,
  getInventories,
  getInventory,
} from "@/api/inventoryApi";
import { adjustInventoryItem } from "@/lib/inventory";
import type { AdjustInventoryInput, Inventory, InventoryQuery } from "@/types";

export const inventoryKeys = {
  all: ["inventories"] as const,
  list: (query: InventoryQuery) => ["inventories", "list", query] as const,
  detail: (matnr: string) => ["inventories", "detail", matnr] as const,
};

export function useInventories(query: InventoryQuery = {}) {
  return useQuery({
    queryKey: inventoryKeys.list(query),
    queryFn: () => getInventories(query),
    placeholderData: keepPreviousData,
  });
}

export function useInventoryDetail(matnr: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(matnr),
    queryFn: () => getInventory(matnr),
    enabled: Boolean(matnr),
  });
}

export function useAdjustInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adjustInventory,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: inventoryKeys.all });

      const previousLists = queryClient.getQueriesData<Inventory[]>({
        queryKey: ["inventories", "list"],
      });
      const previousDetail = queryClient.getQueryData<Inventory>(
        inventoryKeys.detail(input.matnr),
      );

      const adjust = (item: Inventory) =>
        item.matnr === input.matnr ? adjustInventoryItem(item, input.delta) : item;

      queryClient.setQueriesData<Inventory[]>(
        { queryKey: ["inventories", "list"] },
        (items) => items?.map(adjust),
      );

      if (previousDetail) {
        queryClient.setQueryData(
          inventoryKeys.detail(input.matnr),
          adjustInventoryItem(previousDetail, input.delta),
        );
      }

      return { previousLists, previousDetail };
    },
    onError: (_error, input, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(
          inventoryKeys.detail(input.matnr),
          context.previousDetail,
        );
      }
    },
    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(input.matnr),
      });
    },
  });
}

export function useAdjustInventoryHandler() {
  const mutation = useAdjustInventory();

  return {
    ...mutation,
    adjustStock: (input: AdjustInventoryInput) => mutation.mutate(input),
  };
}
