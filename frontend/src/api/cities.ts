import api from "./axios";

export interface City {
id: string;
name: string;
country_id: string;
}

export const getCities = async (): Promise<City[]> => {
const response = await api.get("/cities/read_city");
return response.data;
};

export const createCity = async (
data: Omit<City, "id">
): Promise<City> => {
const response = await api.post("/cities/create_city", data);
return response.data;
};

export const updateCity = async (
cityId: string,
data: Omit<City, "id">
): Promise<City> => {
const response = await api.put(
`/cities/update_city/${cityId}`,
data
);
return response.data;
};

export const deleteCity = async (cityId: string): Promise<void> => {
await api.delete(`/cities/delete_city/${cityId}`);
};
