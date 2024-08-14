import {
  createDirectus,
  rest,
  authentication,
  staticToken,
} from "@directus/sdk";

export const directusClient = createDirectus(process.env.DIRECTUS_URL!)
  .with(authentication())
  .with(rest());

export const directusServerClient = createDirectus(process.env.DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_ADMIN!))
  .with(rest());
