module.exports = {
  mongodbMemoryServer: {
    version: "7.0.0",
  },
  mongodbMemoryServerOptions: {
    instance: {
      dbName: "jest",
    },
    binary: {
      version: "7.0.0",
      skipMD5: true,
    },
    autoStart: false,
  },
};
