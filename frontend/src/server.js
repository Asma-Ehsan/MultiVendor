// export const server = "http://localhost:8000/api/v2";
// export const backend_url = "http://localhost:8000/";

// export const server = "https://multi-vendor-two-xi.vercel.app/api/v2";
// export const backend_url = "https://multi-vendor-two-xi.vercel.app/";

export const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") {
    if (image.startsWith("http")) return image;
    return `${backend_url}uploads/${image}`;
  }
  return image.url || "";
};

export const server =
  process.env.REACT_APP_SERVER || "http://localhost:8000/api/v2";
export const backend_url =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/";