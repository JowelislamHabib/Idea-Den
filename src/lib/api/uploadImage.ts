const IMGBB_URL = "https://api.imgbb.com/1/upload";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("key", process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API!);
  formData.append("image", file);

  const res = await fetch(IMGBB_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  return data.data.url as string;
}

const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|gif|webp|svg)$/i;

export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return IMAGE_EXTENSIONS.test(parsed.pathname);
  } catch {
    return false;
  }
}
