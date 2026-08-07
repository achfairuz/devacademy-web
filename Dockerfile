FROM node:24-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY node_modules ./node_modules

ARG SKIP_INSTALL=false
RUN if [ "$SKIP_INSTALL" = "true" ]; then echo "skip npm ci (offline)"; else npm ci; fi

COPY . .

ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
