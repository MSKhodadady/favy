-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "user_created" UUID,
    "date_created" TIMESTAMPTZ(6),
    "name" VARCHAR(255) NOT NULL,
    "start_year" INTEGER,
    "end_year" INTEGER NOT NULL,
    "other_info" JSON NOT NULL DEFAULT '{}',
    "admin_accepted" BOOLEAN DEFAULT false,
    "poster" UUID,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieFav" (
    "id" SERIAL NOT NULL,
    "Movie_id" INTEGER,
    "user_id" UUID,

    CONSTRAINT "MovieFav_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "email" VARCHAR(128),
    "password" VARCHAR(255),
    "location" VARCHAR(255),
    "description" TEXT,
    "tags" JSON,
    "avatar" VARCHAR,
    "language" VARCHAR(255),
    "username" VARCHAR(255) NOT NULL,
    "email_verified" BOOLEAN DEFAULT false,

    CONSTRAINT "directus_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movie_name_unique" ON "Movie"("name");

-- CreateIndex
CREATE UNIQUE INDEX "directus_users_email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "directus_users_username_unique" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "movie_user_created_foreign" FOREIGN KEY ("user_created") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MovieFav" ADD CONSTRAINT "moviefav_movie_id_foreign" FOREIGN KEY ("Movie_id") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MovieFav" ADD CONSTRAINT "moviefav_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

