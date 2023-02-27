import { useQuery } from "@apollo/client";
import {
  LOGIN_NAME_QUERY,
  type LoginNameQueryResponseData,
} from "@/client/queries";

export default function useLoginName() {
  const { data, loading } =
    useQuery<LoginNameQueryResponseData>(LOGIN_NAME_QUERY);
  return { loginName: data?.viewer?.login, loading };
}
