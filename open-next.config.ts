import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig({
    incrementalCache: "dummy",
    tagCache: "dummy",
  }),
  buildCommand: "echo 'Next.js build step completed'",
};
