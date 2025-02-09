import type { Config } from "tailwindcss";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

export default {
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["lucide"]),
    }),
  ],
} satisfies Config;
