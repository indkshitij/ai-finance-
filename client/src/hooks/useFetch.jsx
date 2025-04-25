import { useState } from "react";
import axios from "axios";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(undefined);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const apiCall = async (method, apiLink, payload = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${backendUrl}${apiLink}`;

      let response;
      switch (method.toLowerCase()) {
        case "get":
          response = await axios.get(url, { withCredentials: true });
          break;
        case "post":
          response = await axios.post(url, payload, { withCredentials: true });
          break;
        case "put":
          response = await axios.put(url, payload, { withCredentials: true });
          break;
        case "delete":
          response = await axios.delete(url, {
            data: payload,
            withCredentials: true,
          });
          break;
        default:
          throw new Error("Invalid HTTP method");
      }

      if (response.data?.success) {
        setData(response.data?.data);

        return { success: true, data: response.data?.data };
      } else {
        setError(
          response?.data?.message ||
            "Oops! Something went wrong. Please try again."
        );
        return { success: false };
      }
    } catch (err) {
      console.log(err);
      const serverMessage = err?.response?.data?.message;
      const finalMessage =
        serverMessage ||
        err?.message ||
        "An unexpected error occurred. Please try again later.";

      setError(finalMessage);
      return { success: false, message: finalMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, apiCall, setData };
};

export default useFetch;
