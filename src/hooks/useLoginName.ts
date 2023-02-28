import { useQuery } from "@apollo/client";
import {
  GET_LOGIN_NAME,
  type LoginNameQueryResponseData,
} from "@/client/queries";

export default function useLoginName() {
  const { data, loading } =
    useQuery<LoginNameQueryResponseData>(GET_LOGIN_NAME);
  return { loginName: data?.viewer?.login, loading };
}
