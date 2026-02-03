import api from "./api";

// Define the structure for an Adoption Pet based on the user's provided JSON
export interface AdoptionPet {
  id: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: number;
  petGender: "male" | "female"; // API returns lowercase 'male'/'female'
  avatarUrl: string;
  status: "available" | "pending" | "adopted"; // Matching API status
  price: number;
}

export interface AdoptionResponse {
  success: boolean;
  data: {
    data: AdoptionPet[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdoptionFilters {
  status?: string; // "all", "available", "pending", "adopted"
  page?: number;
  limit?: number;
  search?: string;
  gender?: string;
  type?: string[];
  minAge?: number;
  maxAge?: number;
}

class AdoptionService {
  /**
   * Fetch adoptions with filters
   * @param filters Filtering options including status
   * @returns AdoptionResponse
   */
  async getAdoptions(filters: AdoptionFilters = {}): Promise<AdoptionResponse> {
    const params = new URLSearchParams();

    // Default to 'all' if no status is provided, or use the provided status
    // Ensure status is lowercase to match API expectation if needed,
    // though the user request showed ?status=all | available | etc.
    if (filters.status) {
      params.append("status", filters.status.toLowerCase());
    } else {
      params.append("status", "all");
    }

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    // Add other filters if the backend supports them (assuming standard pattern)
    if (filters.search) params.append("search", filters.search);
    if (filters.gender && filters.gender !== "Both")
      params.append("gender", filters.gender.toLowerCase());

    // Type usually needs to be handled as array or repeated param depending on backend
    if (filters.type && filters.type.length > 0) {
      // Simple comma separated for now, adjust if backend needs multiple keys
      params.append("type", filters.type.join(","));
    }

    if (filters.minAge !== undefined)
      params.append("minAge", filters.minAge.toString());
    if (filters.maxAge !== undefined)
      params.append("maxAge", filters.maxAge.toString());

    const queryString = params.toString();
    const url = `/adoptions?${queryString}`;

    return await api.get<AdoptionResponse>(url);
  }

  /**
   * Get single adoption listing details
   * @param id The listing ID
   */
  async getAdoptionDetails(
    id: string,
  ): Promise<{ success: boolean; data: AdoptionDetail }> {
    return await api.get<{ success: boolean; data: AdoptionDetail }>(
      `/adoptions/${id}`,
    );
  }
  /**
   * Get health records for a specific adoption listing
   * @param id The listing ID
   * @param type The type of health record (e.g., 'vaccination')
   */
  async getAdoptionHealthRecords(
    id: string,
    type: string,
  ): Promise<{ success: boolean; data: AdoptionHealthRecord[] }> {
    return await api.get<{ success: boolean; data: AdoptionHealthRecord[] }>(
      `/adoptions/${id}/health-records?type=${type}`,
    );
  }

  /**
   * Get single health record details
   * @param id The listing ID
   * @param recordId The record ID
   */
  async getHealthRecordDetails(
    id: string,
    recordId: string,
  ): Promise<{ success: boolean; data: any }> {
    return await api.get<{ success: boolean; data: any }>(
      `/adoptions/${id}/health-records/${recordId}`,
    );
  }

  /**
   * Get basket items
   */
  async getBasket(): Promise<BasketResponse> {
    return await api.get<BasketResponse>("/adoptions/basket");
  }

  /**
   * Add item to basket
   * @param listingId
   */
  async addToBasket(
    listingId: string,
  ): Promise<{ success: boolean; message?: string }> {
    return await api.post("/adoptions/basket/items", { listingId });
  }

  /**
   * Remove item from basket
   * @param listingId
   */
  async removeFromBasket(
    listingId: string,
  ): Promise<{ success: boolean; message?: string }> {
    return await api.delete(`/adoptions/basket/items/${listingId}`);
  }

  /**
   * Create adoption order (Mocked)
   * @param items
   * @param total
   */
  async createAdoptionOrder(
    items: BasketItem[],
    total: number,
  ): Promise<{ success: boolean; clientSecret: string; orderId: string }> {
    // ... mocked implementation ...
    return { success: true, clientSecret: "", orderId: "" };
  }

  /**
   * Create checkout session
   * @param payload
   */
  async createCheckoutSession(payload: {
    listingIds: string[];
    customer: {
      name: string;
      address: string;
      phone: string;
    };
  }): Promise<CheckoutResponse> {
    return await api.post<CheckoutResponse>(
      "/adoptions/basket/checkout",
      payload,
    );
  }

  /**
   * Get adoption history orders
   */
  async getAdoptionOrders(): Promise<AdoptionOrdersResponse> {
    return await api.get<AdoptionOrdersResponse>("/adoptions/me/orders");
  }

  /**
   * Get single adoption order by ID
   * @param orderId
   */
  async getAdoptionOrderById(
    orderId: string,
  ): Promise<{ success: boolean; data: AdoptionOrder }> {
    return await api.get<{ success: boolean; data: AdoptionOrder }>(
      `/adoptions/me/orders/${orderId}`,
    );
  }
}

export interface AdoptionOrder {
  orderId: string;
  status: string;
  paymentStatus: string;
  paidAt: string | null;
  createdAt: string;
  currency: string;
  paymentIntentId: string;
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  processingFee: number;
  shippingFee: number;
  total: number;
  items: {
    listingId: string;
    petName: string;
    petType: string;
    petBreed: string;
    petAge: number;
    petGender: string;
    avatarUrl: string;
    price: number;
  }[];
}

export interface AdoptionOrdersResponse {
  success: boolean;
  data: AdoptionOrder[];
}

export interface CheckoutResponse {
  success: boolean;
  data: {
    orderId: string;
    paymentIntentId: string;
    clientSecret: string;
    customer: {
      name: string;
      address: string;
      phone: string;
    };
    subtotal: number;
    taxPercent: number;
    taxAmount: number;
    processingFee: number;
    shippingFee: number;
    total: number;
    items: {
      listing: string;
      petName: string;
      petType: string;
      petBreed: string;
      petAge: number;
      petGender: string;
      avatarUrl: string;
      price: number;
    }[];
  };
  message: string;
}

export interface BasketItem {
  listingId: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: number;
  avatarUrl: string;
  price: number;
  status: string;
  addedAt?: string;
}

export interface BasketResponse {
  success: boolean;
  data: {
    items: BasketItem[];
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface AdoptionHealthRecord {
  id: string;
  type: string;
  recordName: string;
  lastUpdated: string;
  reminder: {
    enabled: boolean;
    offset: string;
  };
}

export interface AdoptionDetail extends AdoptionPet {
  weightLbs: number;
  photos: string[];
  vaccinated: boolean;
  neutered: boolean;
  trained: boolean;
  shelterName: string;
  shelterPhone: string;
  aboutPet: string;
  personality: string[];
  healthSummary: {
    [key: string]: {
      count: number;
      lastUpdated: string;
    };
  };
}

export const adoptionService = new AdoptionService();
export default adoptionService;
