# frontend/Dockerfile

# --- Этап 1: Сборка (Build) ---
FROM node:20-slim AS build

WORKDIR /app

# Копируем только файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости, включая опциональные
RUN npm install --include=optional

# Копируем остальной код и собираем
COPY . .
RUN npm run build

# --- Этап 2: Раздача статики (Serve) ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]