import api from "./axios";

export interface Airport {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city_id: string;
}

export const getAirports = async (): Promise<Airport[]> => {
  const response = await api.get("/airports/read_airports");
  return response.data;
};

export const createAirport = async (
  data: Omit<Airport, "id">
): Promise<Airport> => {
  const response = await api.post("/airports/create_airport", data);
  return response.data;
};

export const updateAirport = async (
  airportId: string,
  data: Omit<Airport, "id">
): Promise<Airport> => {
  const response = await api.put(
    `/airports/update_airport/${airportId}`,
    data
  );
  return response.data;
};

export const deleteAirport = async (airportId: string): Promise<void> => {
  await api.delete(`/airports/delete_airport/${airportId}`);
};