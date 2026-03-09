import tseslint from "typescript-eslint"

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: [".next/**", "node_modules/**", "*.config.*", "content/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
)
