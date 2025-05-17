import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type CloudinaryTransformation = {
  quality?: string;
  fetch_format?: string;
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  [key: string]: string | number | undefined;
};

type UploadOptions = {
  folder?: string;
  transformation?: CloudinaryTransformation[];
  tags?: string[];
};

export async function uploadToCloudinary(
  fileBase64: string,
  options: UploadOptions = {},
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: options.folder || "carpfishing",
      resource_type: "image",
      transformation: options.transformation,
      tags: options.tags,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

export async function uploadGalleryPhoto(
  fileBase64: string,
  caption?: string,
): Promise<string> {
  return uploadToCloudinary(fileBase64, {
    folder: "carpfishing/gallery",
    tags: ["gallery", caption || ""],
    transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
  });
}

export function getCloudinaryMediaUrl(
  publicId: string,
  resourceType: "video" | "image" | "audio" = "image",
): string {
  return cloudinary.url(publicId, { resource_type: resourceType });
}

export function getCloudinaryVideoUrl(publicId: string = "video_o2wshx"): string {
  return getCloudinaryMediaUrl(publicId, "video");
}

export function getCloudinaryAudioUrl(publicId: string = "rap-peche_faknff"): string {
  return getCloudinaryMediaUrl(publicId, "video");
}

export type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at: string;
  width: number;
  height: number;
  format: string;
  tags: string[];
  resource_type?: string;
};

export async function getGalleryPhotos(
  limit: number = 100,
): Promise<CloudinaryResource[]> {
  try {
    const result = await cloudinary.search
      .expression("folder:carpfishing/gallery")
      .sort_by("created_at", "desc")
      .max_results(limit)
      .execute();

    return result.resources;
  } catch (error) {
    console.error("Error fetching gallery photos from Cloudinary:", error);
    throw new Error("Failed to fetch gallery photos from Cloudinary");
  }
}
