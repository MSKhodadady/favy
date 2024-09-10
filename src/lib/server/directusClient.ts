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
  const DIRECTUS_PROTOCOL =
    /** @type {"http" | "https"} */ process.env.DIRECTUS_PROTOCOL ?? "http";
  const DIRECTUS_HOSTNAME = process.env.DIRECTUS_HOSTNAME ?? "";
  if (DIRECTUS_HOSTNAME.length == 0)
    throw Error("No directus hostname in env.");

  const DIRECTUS_PORT = process.env.DIRECTUS_PORT ?? "8055";

  return `${DIRECTUS_PROTOCOL}://${DIRECTUS_HOSTNAME}:${DIRECTUS_PORT}`;
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
