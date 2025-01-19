FROM node:20-slim
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "start", "--port=5173"];
