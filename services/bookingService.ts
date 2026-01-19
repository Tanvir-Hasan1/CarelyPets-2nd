import api from "./api";

interface AvailabilityResponse {
  success: boolean;
  data: {
    date: string;
    slots: string[];
  };
}

export interface Service {
  _id: string;
  name: string;
  type: string;
  price: number;
  isActive: boolean;
}

export interface ServicesResponse {
  success: boolean;
  data: {
    services: Service[];
    taxPercent: number;
  };
}

export const bookingService = {
  /**
   * Get available booking slots for a specific date
   * @param date Date string in YYYY-MM-DD format
   */
  async getAvailability(date: string): Promise<string[]> {
    const response = await api.get<AvailabilityResponse>(
      `/bookings/availability?date=${date}`,
    );
    if (response.success && response.data) {
      return response.data.slots;
    }
    return [];
  },

  /**
   * Get all available services and pricing
   */
  async getServices(): Promise<ServicesResponse["data"]> {
    const response = await api.get<ServicesResponse>("/services");
    if (response.success && response.data) {
      return response.data;
    }
    return { services: [], taxPercent: 0 };
  },

  /**
   * Create a new booking
   */
  async createBooking(data: {
    serviceIds: string[];
    petIds: string[];
    scheduledAt: string;
    reminderType: string;
  }): Promise<{ booking: any; clientSecret: string }> {
    const response = await api.post<{
      success: boolean;
      data: { booking: any; clientSecret: string };
    }>("/bookings", data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Failed to create booking");
  },

  /**
   * Get all bookings for the current user
   */
  async getBookings(): Promise<any[]> {
    const response = await api.get<{ success: boolean; data: { data: any[] } }>(
      "/bookings",
    );
    if (response.success && response.data) {
      return response.data.data;
    }
    return [];
  },

  /**
   * Get a specific booking by ID
   */
  async getBookingById(id: string): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>(
      `/bookings/${id}`,
    );
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error("Failed to fetch booking details");
  },
};

export default bookingService;
