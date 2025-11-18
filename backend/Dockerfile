FROM node:20-alpine

WORKDIR /app

# Install production dependencies first
COPY package*.json ./
RUN npm install

# Install TypeScript and type definitions
RUN npm install -D typescript @types/node @types/cors @types/express @types/pg

# Copy source files
COPY tsconfig.json ./
COPY src ./src

# Build the application
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start", "start:prod"]
