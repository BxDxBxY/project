module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
      // 🚫 Disable annoying/unnecessary rules
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "no-console": "off",
    },
  }
  