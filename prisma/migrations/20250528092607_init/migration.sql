-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('text', 'link', 'image');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "ContentType" NOT NULL,
    "shortLink" TEXT NOT NULL,
    "expirationTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkContent" (
    "contentId" INTEGER NOT NULL,
    "longLink" TEXT NOT NULL,

    CONSTRAINT "LinkContent_pkey" PRIMARY KEY ("contentId")
);

-- CreateTable
CREATE TABLE "TextSnippet" (
    "contentId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "TextSnippet_pkey" PRIMARY KEY ("contentId")
);

-- CreateTable
CREATE TABLE "ImageContent" (
    "contentId" INTEGER NOT NULL,
    "imageData" BYTEA NOT NULL,

    CONSTRAINT "ImageContent_pkey" PRIMARY KEY ("contentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Content_shortLink_key" ON "Content"("shortLink");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkContent" ADD CONSTRAINT "LinkContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextSnippet" ADD CONSTRAINT "TextSnippet_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageContent" ADD CONSTRAINT "ImageContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
