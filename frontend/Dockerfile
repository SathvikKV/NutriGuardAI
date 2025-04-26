# --- Step 1: Use Node base image ---
    FROM node:20

    # --- Step 2: Set work directory ---
    WORKDIR /app
    
    # --- Step 3: Copy only package.json and lockfile first ---
    COPY package.json pnpm-lock.yaml ./
    
    # --- Step 4: Install pnpm and dependencies ---
    RUN npm install -g pnpm \
        && pnpm install
    
    # --- Step 5: Copy rest of the app code ---
    COPY . .
    
    # --- Step 6: Build the Next.js app ---
    RUN pnpm build
    
    # --- Step 7: Expose port and start ---
    EXPOSE 3000
    CMD ["pnpm", "start"]
    