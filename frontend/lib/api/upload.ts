import { fetch } from "expo/fetch";
import { File } from "expo-file-system";

export async function uploadFile(
  uploadUrl: string,
  localUri: string,
  contentType: string,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: new File(localUri),
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
}
