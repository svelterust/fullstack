import type { Config } from "tailwindcss";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

export default {
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["lucide"]),
    }),
  ],
} satisfies Config;
