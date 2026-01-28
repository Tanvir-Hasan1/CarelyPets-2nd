import api from "./api";

export interface LegalContent {
  content: string;
  updatedAt: string;
}

const legalService = {
  getTerms: async (): Promise<LegalContent | null> => {
    try {
      // api.get returns the parsed JSON body directly
      const response = await api.get<any>("/legal/terms");

      console.log(
        "[LegalService] Terms Response:",
        JSON.stringify(response, null, 2),
      );

      // The API returns the content object directly: { content: "...", updatedAt: "..." }
      if (response && response.content) {
        return response as LegalContent;
      }

      // Fallback in case structure changes to { success: true, data: { ... } }
      if (response && response.success && response.data) {
        return response.data as LegalContent;
      }

      return null;
    } catch (error) {
      console.error("Error fetching terms:", error);
      return null;
    }
  },

  getPrivacyPolicy: async (): Promise<LegalContent | null> => {
    try {
      const response = await api.get<any>("/legal/privacy");

      console.log(
        "[LegalService] Privacy Response:",
        JSON.stringify(response, null, 2),
      );

      if (response && response.content) {
        return response as LegalContent;
      }

      if (response && response.success && response.data) {
        return response.data as LegalContent;
      }

      return null;
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      return null;
    }
  },
};

export default legalService;
