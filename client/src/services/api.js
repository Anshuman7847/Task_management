import axios from "axios";

const baseURL = "http://localhost:5000/api";
const networkListeners = new Set();
let activeRequests = 0;

const notifyNetworkListeners = () => {
  networkListeners.forEach((listener) => listener(activeRequests));
};

const startNetworkRequest = () => {
  activeRequests += 1;
  notifyNetworkListeners();
};

const finishNetworkRequest = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  notifyNetworkListeners();
};

const api = axios.create({
  baseURL,
});

export const subscribeToNetworkActivity = (listener) => {
  networkListeners.add(listener);
  listener(activeRequests);

  return () => {
    networkListeners.delete(listener);
  };
};

api.interceptors.request.use((config) => {
  config.showGlobalLoader = config.showGlobalLoader !== false;

  if (config.showGlobalLoader) {
    startNetworkRequest();
  }

  const token = localStorage.getItem("ttm_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => {
    if (response.config.showGlobalLoader) {
      finishNetworkRequest();
    }

    return response;
  },
  (error) => {
    if (error.config?.showGlobalLoader) {
      finishNetworkRequest();
    }

    return Promise.reject(error);
  }
);

window.addEventListener("beforeunload", () => {
  activeRequests = 0;
  notifyNetworkListeners();
});

export default api;
