//Converts image data into a usable image URL, regardless of its format.


export const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "string") {
    
    // If it starts with "http", it's already a valid URL (like http://example.com/image.jpg), so return it as-is.
    if (image.startsWith("http")) return image;

    //If it's a string without "http", treat it as a filename and build the full URL using the backend + `/uploads/` + filename.

    return `${backend_url}uploads/${image}`;
  }

  // If image wasn't a string at all (it fell through both string checks above), it must be an object — like your Cloudinary format { public_id, url }. So just grab .url from it. If .url doesn't exist for some reason, fall back to an empty string.
  return image.url || "";
};

export const server =
  process.env.REACT_APP_SERVER || "http://localhost:8000/api/v2";
export const backend_url =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/";