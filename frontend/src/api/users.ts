import api from "./axios";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/auth/read_users");
  return response.data;
};

export const createUser = async (
  data: UserRequest
): Promise<User> => {
  const response = await api.post("/auth/create_user", data);
  return response.data;
};

export const updateUser = async (
  userId: string,
  data: UserRequest
): Promise<User> => {
  const response = await api.put(
    `/auth/update_user/${userId}`,
    data
  );
  return response.data;
};

export const deleteUser = async (
  userId: string
): Promise<void> => {
  await api.delete(`/auth/delete_user/${userId}`);
};