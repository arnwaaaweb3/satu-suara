// craco.config.js
module.exports = {
  // Ini adalah solusi untuk DeprecationWarning dari webpack-dev-server
  // yang tidak bisa dihilangkan hanya dengan update react-scripts
  webpack: {
    configure: (webpackConfig) => {
      // Menghapus `onBeforeSetupMiddleware` dan `onAfterSetupMiddleware`
      // dari konfigurasi webpack-dev-server
      if (webpackConfig.devServer) {
        delete webpackConfig.devServer.onBeforeSetupMiddleware;
        delete webpackConfig.devServer.onAfterSetupMiddleware;
      }
      return webpackConfig;
    },
  },
  devServer: {
    // Menambahkan `setupMiddlewares` yang direkomendasikan
    setupMiddlewares: (middlewares, devServer) => {
      // Middleware kosong, karena kita hanya ingin menimpa yang lama
      return middlewares;
    },
  },
};