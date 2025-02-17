FROM node:18

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies and types
RUN npm install && \
    npm install --save-dev @types/react @types/react-dom @types/node && \
    npm install --save lucide-react

# Start development server
CMD ["npm", "start"]