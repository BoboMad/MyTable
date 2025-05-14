import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";
import { Status } from "../types/types";

const QUERY_KEY = "Statuses";

export const getStatuses = (): Promise<Status[]> => {
  return axios.get(`status`);
};

type QueryFnType = typeof getStatuses;

type useGetStatusesProp = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetStatuses = ({ config }: useGetStatusesProp) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: [QUERY_KEY],
    queryFn: getStatuses,
    ...config,
  });
};
