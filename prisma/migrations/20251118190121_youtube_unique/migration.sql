/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `YoutubeChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "YoutubeChannel_url_key" ON "YoutubeChannel"("url");
