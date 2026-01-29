export default {
  expo: {
    name: "CarelyPets",
    slug: "CarelyPets",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/new-logo-updated.png",
    scheme: "carelypets",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
        backgroundImage: "./assets/images/android-icon-background.png",
        foregroundImage: "./assets/images/new-logo-updated.png",
        monochromeImage: "./assets/images/new-logo-updated.png",
      },

      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.CAMERA",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_LOCATION",
      ],
      package: "com.anonymous.CarelyPets",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/Splash-screen-2.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#e4f6ff",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them.",
          cameraPermission:
            "The app accesses your camera to let you take photos.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera.",
        },
      ],
      "expo-location",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
