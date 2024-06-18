import RouterPaths from "@constants/routerPaths";
import StorageKeys from "@constants/storageKeys";
import BrowserPersistence from "@utils/simplePersistence";
import axios from "axios";

const apiClient = () => {
  const storage = new BrowserPersistence();
  const token = storage.getItem(StorageKeys.SIGNIN_TOKEN) || null;
  const reqInstance = axios.create({
    baseURL: "/",
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const unAuthorized = (status) => {
    return status === 401;
  };

  const get = async (uri, config = {}) => {
    try {
      const response = await reqInstance.get(uri, config);
      return response;
    } catch (error) {
      if (unAuthorized(error?.response?.status)) {
        storage.removeItem(StorageKeys.SIGNIN_TOKEN);
        window.location.replace(RouterPaths.LOGIN);
      }
      console.error(error);
      return { error: error, status: error?.response?.status };
    }
  };

  const post = async (uri, params, config = {}) => {
    try {
      const response = await reqInstance.post(uri, params, config);
      return response;
    } catch (error) {
      return { error: error };
    }
  };

  const patch = async (uri, params, config = {}) => {
    try {
      const response = await reqInstance.patch(uri, params, config);
      return response;
    } catch (error) {
      return { error };
    }
  };

  const put = async (uri, params, config = {}) => {
    try {
      const response = await reqInstance.put(uri, params, config);
      return response;
    } catch (error) {
      return { error };
    }
  };

  const remove = async (uri, config = {}) => {
    try {
      const response = await reqInstance.delete(uri, config);
      return response;
    } catch (error) {
      return { error };
    }
  };

  return {
    get,
    put,
    post,
    patch,
    remove,
  };
};

export default apiClient;
