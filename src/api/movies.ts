import { readItem } from "@directus/sdk";
import { directusPublicClient } from "../lib/server/directusClient";

export const moviesApi = {
  async getMovie(
    id: string,
    fields = ["id", "Name", "start_year", "end_year", "poster"]
  ) {
    return directusPublicClient.request(readItem("Movie", id, { fields }));
  },
};
