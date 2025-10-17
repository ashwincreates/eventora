import { Response } from "@/types/api";

export const validateResponse = <T>(response: Response<T>) => {
  if (!response.success) {
    throw new Error(response.message);
  }

  return response.data;
};
