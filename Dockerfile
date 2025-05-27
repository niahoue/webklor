# Dockerfile pour l'application WebKlor (Multi-stage build)

# Stage 1: Build du frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine AS backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Installer un serveur statique pour le frontend
RUN npm install -g serve

# Copier le build du frontend
COPY --from=frontend-builder /app/dist ./dist

# Copier le backend
COPY --from=backend /app/server ./server

# Créer un script de démarrage
RUN echo '#!/bin/sh' > start.sh && \
    echo 'serve -s dist -l 3000 &' >> start.sh && \
    echo 'cd server && npm start &' >> start.sh && \
    echo 'wait' >> start.sh && \
    chmod +x start.sh

# Exposer les ports
EXPOSE 3000 5000

# Santé du container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Démarrer l'application
CMD ["./start.sh"]
