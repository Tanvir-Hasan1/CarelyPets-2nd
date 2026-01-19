import bookingService from "@/services/bookingService";
import { create } from "zustand";

interface BookingState {
  bookings: any[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<any>;
  getBookingById: (id: string) => any;
  setBookings: (bookings: any[]) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await bookingService.getBookings();
      set({ bookings, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch bookings",
        isLoading: false,
      });
    }
  },

  fetchBookingById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingService.getBookingById(id);
      set((state) => {
        const index = state.bookings.findIndex((b) => b._id === id);
        if (index !== -1) {
          const newBookings = [...state.bookings];
          newBookings[index] = booking;
          return { bookings: newBookings, isLoading: false };
        } else {
          return { bookings: [...state.bookings, booking], isLoading: false };
        }
      });
      return booking;
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch booking detail",
        isLoading: false,
      });
      return null;
    }
  },

  getBookingById: (id: string) => {
    return get().bookings.find((b) => b._id === id);
  },

  setBookings: (bookings) => set({ bookings }),
}));

export default useBookingStore;
