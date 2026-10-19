import { requestJson } from "@/api/http";
import type { AuthUser, LoginInput } from "@/types";

type LoginResponse = {
  user: AuthUser;
};

export function login(input: LoginInput) {
  return requestJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
