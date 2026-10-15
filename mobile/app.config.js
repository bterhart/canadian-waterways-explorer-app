// Dynamic Expo config. app.json stays the source of truth for everything that is
// safe to commit; this file layers in values that must NOT live in the (public)
// repository. Expo loads app.json first and passes it here as `config`.
//
// GOOGLE_MAPS_ANDROID_API_KEY — required for react-native-maps on Android
// (Google is the only map provider there; without a key every map is blank).
// Set it as an EAS environment variable (never in app.json / .env):
//   eas env:create --scope project --environment production \
//     --name GOOGLE_MAPS_ANDROID_API_KEY --value <key> --visibility secret
// For local `expo run:android`, export it in the shell before starting.
module.exports = ({ config }) => {
  const androidMapsKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;

  return {
    ...config,
    android: {
      ...config.android,
      ...(androidMapsKey
        ? { config: { ...(config.android?.config ?? {}), googleMaps: { apiKey: androidMapsKey } } }
        : {}),
    },
  };
};
