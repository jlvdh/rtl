FROM node:8.12.0
RUN npm i npm@latest -g && npm i pm2 -g && npm install
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "app"]