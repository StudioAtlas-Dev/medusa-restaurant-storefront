import Medusa from "@medusajs/medusa-js";

const MEDUSA_BACKEND_URL = "http://localhost:9000";

export const medusaClient = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    maxRetries: 3,
    publishableApiKey: "pk_226eb6a5b6a184752e6f1808b6bfd59f30a9d0ad68cfa8276e4ca9e760e91c96"
});
