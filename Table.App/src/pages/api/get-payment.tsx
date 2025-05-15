import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { Payment } from "../types/types";

export const QUERY_KEY = "Payments";

export const getPayments = (): Promise<Payment[]> => {
  return axios.get(`payment`);
};

type QueryFnType = typeof getPayments;

type useGetPaymentsProp = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetPayments = ({ config }: useGetPaymentsProp) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: [QUERY_KEY],
    queryFn: getPayments,
    ...config,
  });
};
