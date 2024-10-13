export const env = import.meta.env.VITE_REACT_APP_ENV || "local";

let backendApi;

switch (env) {
  case "dev":
    backendApi = "https://sensy.onrender.com/";
    break;
  case "prod":
    backendApi = "https://api.robosensy.in";
    break;
  default:
    backendApi = "http://localhost:8000";
}

export const baseURL = backendApi;
