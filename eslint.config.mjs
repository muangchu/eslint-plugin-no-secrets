import { defineConfig } from "eslint/config";
import noSecrets from "@muangchu/eslint-plugin-no-secrets";

export default defineConfig([{
    plugins: {
        "no-secrets": noSecrets,
    },

    rules: {
        "no-secrets/no-secrets": "error",
        "no-secrets/enforce-foo-bar": "error"
    },
}]);