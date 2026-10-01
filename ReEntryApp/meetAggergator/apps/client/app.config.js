module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...(config.plugins ?? []).filter(plugin => (Array.isArray(plugin) ? plugin[0] : plugin) !== 'expo-build-properties'),
    ['expo-build-properties', {
      android: { usesCleartextTraffic: process.env.EXPO_ALLOW_LOCAL_HTTP === '1' },
    }],
  ],
});
