const a = {
  models: {
    user: {
      fields: {
        isAdmin: false,
        username: "",
        email: "",
        password: "",
        avatarLink: "",
        emailVerified: false,

        likedMovies: [],
      },
    },
    movie: {
      fields: {
        name: "",

        startYear: "",
        endYear: "",
        accepted: {
          user: "",
          time: "",
        },

        userCreated: "",
        dataCreated: "",
      },
    },
  },

  operations: {
    signUp: "",
    verifyEmail: "",
    signIn: "",

    searchMovie: "",
    createMovie: "",
    addMovie: "",

    changeAvatar: "",
    changeDescription: "",
    removeMovie: "",

    searchUsername: "",
  },
};
