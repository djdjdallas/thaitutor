module.exports = function (api) {
  // Jest sets env to "test". The app itself is built with babel-preset-expo,
  // but our pure-logic unit tests (dates/srs) only need plain ESM -> CJS, so we
  // use @babel/preset-env there to avoid pulling the whole RN transform chain.
  const isTest = api.env("test");
  api.cache(true);
  return {
    presets: isTest ? ["@babel/preset-env"] : ["babel-preset-expo"],
  };
};
