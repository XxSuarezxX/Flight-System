import api from "./axios";

export interface Country {
  id: string;
  name: string;
  iso_code: string;
}

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get("/locations/read_country");
  return response.data;
};

export const createCountry = async (
  data: Omit<Country, "id">
): Promise<Country> => {
  const response = await api.post("/locations/create_country", data);
  return response.data;
};

export const updateCountry = async (
  countryId: string,
  data: Omit<Country, "id">
): Promise<Country> => {
  const response = await api.put(
    `/locations/update_country/${countryId}`,
    data
  );

  return response.data;
};

export const deleteCountry = async (countryId: string): Promise<void> => {
  await api.delete(`/locations/delete_country/${countryId}`);
};