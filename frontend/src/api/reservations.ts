
import api from "./axios";

export interface PassengerRequest {
  first_name: string;
  last_name: string;
  identification: number;
}

export interface ReservationRequest {
  flight_id: string;
  passengers: PassengerRequest[];
}

export interface Passenger {
  id: string;
  first_name: string;
  last_name: string;
  identification: number;
}

export interface Reservation {
  id: string;
  user_id: string;
  flight_id: string;
  price: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  created_at: string;
  updated_at: string;
}

export interface FlightDetails {
  id: string;
  flight_number: string;
  origin_airport_id: string;
  destination_airport_id: string;
  departure_at: string;
  arrival_at: string;
  price: number;
}

export interface ReservationDetails extends Reservation {
  passengers: Passenger[];
  flight: FlightDetails;
}

export const createReservation = async (
  data: ReservationRequest
): Promise<Reservation> => {
  const response = await api.post(
    "/reservations/create_reservation",
    data
  );
  return response.data;
};

export const getUserReservations = async (): Promise<Reservation[]> => {
  const response = await api.get("/reservations/get_user_reservations");
  return response.data;
};

export const getReservationDetails = async (
  reservationId: string
): Promise<ReservationDetails> => {
  const response = await api.get(
    "/reservations/get_reservation_details",
    {
      params: { reservation_id: reservationId },
    }
  );
  return response.data;
};

export const cancelReservation = async (
  reservationId: string
): Promise<Reservation> => {
  const response = await api.post(
    "/reservations/cancel_reservation",
    null,
    {
      params: { reservation_id: reservationId },
    }
  );
  return response.data;
};
