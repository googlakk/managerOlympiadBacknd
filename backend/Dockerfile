# Dockerfile для Strapi Backend
FROM node:18

# Установим рабочую директорию
WORKDIR /app

# Скопируем package.json и установим зависимости
COPY package.json yarn.lock ./
RUN yarn install

# Скопируем все файлы
COPY . .

# Запустим сервер
CMD ["yarn", "start"]
