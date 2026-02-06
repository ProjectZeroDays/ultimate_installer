FROM denoland/deno:1.40

WORKDIR /app

# Copy source code
COPY . .

# Cache dependencies
RUN deno cache src/main.ts

# Compile binary
RUN deno compile --allow-all --output /usr/local/bin/ultimate-installer src/main.ts

# Set entrypoint
ENTRYPOINT ["ultimate-installer"]
CMD ["--help"]
