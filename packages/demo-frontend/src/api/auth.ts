import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "https://ai-edu-demo-stack.illmatah.workers.dev"
})