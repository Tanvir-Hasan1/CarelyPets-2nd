/**
 * Application Configuration
 * Reads environment variables and provides typed config values with defaults.
 *
 * In Expo, environment variables prefixed with EXPO_PUBLIC_ are automatically
 * available via process.env at build time.
 */

interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
  };
}

const config: AppConfig = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.example.com",
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "60000", 10),
  },
  app: {
    name: "CarelyPets",
    version: "1.0.0",
  },
};

export default config;
