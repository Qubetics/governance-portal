FROM node:18-alpine AS builder

WORKDIR /home/node
COPY --chown=node:node . .

# USER node
RUN npm install
RUN npm run build

FROM nginx:mainline-alpine

COPY --from=builder /home/node/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3008