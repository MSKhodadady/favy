import {
  createDirectus,
  rest,
  RestCommand,
  staticToken,
  withToken,
} from "@directus/sdk";
import { cookies } from "next/headers";
import { AUTH_COOKIE_KEY } from "../constants";

function getDirectusUrl() {
  return process.env.DIRECTUS_URL ?? "http://localhost:8055";
}

export function getDirectusFileLink(id: string) {
  return `${getDirectusUrl()}/assets/${id}`;
}

export const directusUserClient = createDirectus(getDirectusUrl()).with(rest());

export async function directusUserClientRequestWithAuthCookie<Output>(
  doer: RestCommand<Output, any>
) {
  const cks = cookies();

  return await directusUserClient.request(
    withToken(cks.get(AUTH_COOKIE_KEY)?.value ?? "no-auth", doer)
  );
}

export const directusServerClient = createDirectus(getDirectusUrl())
  .with(staticToken(process.env.DIRECTUS_ADMIN!))
  .with(rest());

export const directusPublicClient = createDirectus(getDirectusUrl()).with(
  rest()
);
