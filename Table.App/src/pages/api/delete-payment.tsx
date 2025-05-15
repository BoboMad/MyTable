import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";

export const removePayments = (paymentIds: number[]): Promise<void> => {
  return axios.delete(`payment`, {
    data: paymentIds,
  });
};

type UseDeletePaymentOptions = {
  config?: MutationConfig<typeof removePayments>;
};

export const useDeletePayments = ({ config }: UseDeletePaymentOptions) => {
  return useMutation({
    ...config,
    mutationFn: removePayments,
  });
};
