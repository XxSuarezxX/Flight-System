import api from "./axios";

export interface Flight {
  id: string;
  flight_number: string;
  origin_airport_id: string;
  destination_airport_id: string;
  departure_at: string;
  arrival_at: string;
  price: number;
  status: string;
}

export interface FlightRequest {
  flight_number: string;
  origin_airport_id: string;
  destination_airport_id: string;
  departure_at: string;
  arrival_at: string;
  price: number;
}

export const getFlights = async (): Promise<Flight[]> => {
  const response = await api.get("/flights/read_flights");
  return response.data;
};

export const createFlight = async (
  data: FlightRequest
): Promise<Flight> => {
  const response = await api.post("/flights/create_flight", data);
  return response.data;
};

export const updateFlight = async (
  flightId: string,
  data: FlightRequest
): Promise<Flight> => {
  const response = await api.put(
    `/flights/update_flight/${flightId}`,
    data
  );
  return response.data;
};

export const deleteFlight = async (
  flightId: string
): Promise<void> => {
  await api.delete(`/flights/delete_flight/${flightId}`);
};