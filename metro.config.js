const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  'obj',
  'glb',
  'mtl',
  'lottie',
);

module.exports = config;
