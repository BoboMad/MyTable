import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { Payment } from "../types/types";

export const createPayments = (payments: Payment[]): Promise<void> => {
  return axios.post(`payment`, payments);
};

type UseCreatePaymentOptions = {
  config?: MutationConfig<typeof createPayments>;
};

export const useCreatePayments = ({ config }: UseCreatePaymentOptions) => {
  return useMutation({
    ...config,
    mutationFn: createPayments,
  });
};
