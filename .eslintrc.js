// Uses Expo's shared rules as the base (matches the SDK 52 toolchain) and
// disables anything that conflicts with Prettier, so Prettier owns formatting
// and ESLint stays focused on correctness.
// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: ["expo", "prettier"],
  ignorePatterns: ["node_modules/", "coverage/", ".expo/", "dist/"],
  overrides: [
    {
      files: ["**/*.test.js"],
      env: { jest: true },
    },
  ],
};
