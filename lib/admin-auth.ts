import { cookies } from "next/headers";
import { ADMIN_PASS, ADMIN_USER } from "./config";

const COOKIE = "naqli_admin";
const TOKEN = "nq_ok_v1";

export function checkCredentials(user: string, pass: string) {
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

export async function setAdminSession() {
  (await cookies()).set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdminRequest() {
  return (await cookies()).get(COOKIE)?.value === TOKEN;
}
