export const moviesApi = {
  // async getMovie(
  //   id: string,
  //   fields = ["id", "Name", "start_year", "end_year", "poster"]
  // ) {
  //   try {
  //     const m = await directusPublicClient.request(
  //       readItem("Movie", id, { fields })
  //     );
  //     return m;
  //   } catch (error) {
  //     if (hasErrorWithCode(error, "FORBIDDEN")) {
  //       return null;
  //     } else {
  //       throw error;
  //     }
  //   }
  // },
  // async addMovie(name: string, year: string, posterImg: File | null) {
  //   //: upload poster if exists
  //   const posterFileId = await (async () => {
  //     if (posterImg == null) return null;
  //     const fd = new FormData();
  //     fd.append("file", posterImg);
  //     const r = await directusServerClient.request(uploadFiles(fd));
  //     return r.id as string;
  //   })();
  //   //: create Movie
  //   const movie = await directusServerClient.request(
  //     createItem("Movie", {
  //       Name: name,
  //       end_year: year,
  //       poster: posterFileId,
  //     })
  //   );
  //   return movie;
  // },
  // async searchMovie(
  //   query: string,
  //   fields = ["id", "Name", "end_year", "poster"]
  // ) {
  //   const res = await directusPublicClient.request(
  //     readItems("Movie", {
  //       search: query,
  //       limit: 10,
  //       fields,
  //     })
  //   );
  //   return res;
  // },
};
