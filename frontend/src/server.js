// export const server = "http://localhost:8000/api/v2";
// export const backend_url = "http://localhost:8000/";

// export const server = "https://multi-vendor-two-xi.vercel.app/api/v2";
// export const backend_url = "https://multi-vendor-two-xi.vercel.app/";

export const server =
  process.env.REACT_APP_SERVER || "http://localhost:8000/api/v2";
export const backend_url =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/";