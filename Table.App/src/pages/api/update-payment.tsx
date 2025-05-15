import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Payment } from "../types/types";

export const updatePayments = (payments: Payment[]): Promise<void> => {
  debugger;
  return axios.put(`payment`, payments);
};

type UseUpdatePaymentOptions = {
  config?: MutationConfig<typeof updatePayments>;
};

export const useUpdatePayments = ({ config }: UseUpdatePaymentOptions) => {
  return useMutation({
    ...config,
    mutationFn: updatePayments,
  });
};
