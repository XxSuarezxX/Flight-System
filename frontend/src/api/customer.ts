import api from "./axios";

export interface CustomerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
}

export interface CustomerProfileUpdate {
  first_name: string;
  last_name: string;
  phone_number: string | null;
}

export const getCustomerProfile = async (): Promise<CustomerProfile> => {
  const response = await api.get("/customer/profile");
  return response.data;
};

export const updateCustomerProfile = async (
  data: CustomerProfileUpdate
): Promise<CustomerProfile> => {
  const response = await api.put("/customer/profile", data);
  return response.data;
};