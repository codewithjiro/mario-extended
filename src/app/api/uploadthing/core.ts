import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // ✅ Input schema for required game item info
    .input(
      z.object({
        name: z.string().min(2),
        category: z.string().min(2),
        type: z.string().optional(),
        power: z.string().optional(),
        effect: z.string().optional(),
        rarity: z.string().optional(),
        description: z.string().optional(),
      })
    )

    // ✅ Auth middleware (runs before upload)
    .middleware(async ({ req, input }) => {
      const { userId } = await auth();

      if (!userId) throw new UploadThingError("Unauthorized");

      // Pass userId + item info to next step
      return { userId, ...input };
    })

    // ✅ Runs after successful upload
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete for user:", metadata.userId);
      console.log("📦 File URL:", file.ufsUrl);


      return { uploadedBy: metadata.userId, imageUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
