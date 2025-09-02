import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "out/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // 👈 make sure it lints only your source
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
