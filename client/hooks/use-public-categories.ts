import { categoryService } from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";

export function usePublicCategories() {
  const query = useQuery({
    queryKey: ["public-categories"],
    retry: false,
    queryFn: async ({ signal }) => {
      const response = await categoryService.findAll(signal);
      return response.data.data;
    },
  });

  return {
    categories: query.data ?? [],
    loading: query.isLoading,
    error: query.isError,
    refetch: query.refetch,
  };
}
