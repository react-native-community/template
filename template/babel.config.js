module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      {
        // Reduces bundle size: without `enableBabelRuntime`, Babel helper functions will be inlined multiple times across different files.
        enableBabelRuntime: require('@babel/runtime/package.json').version,
      },
    ],
  ],
};
