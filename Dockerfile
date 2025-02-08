FROM oven/bun:1.1.43-slim

WORKDIR /app

ENV NODE_ENV=production
ENV BODY_SIZE_LIMIT=25M

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --production

# Build application
COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "build/index.js"]
