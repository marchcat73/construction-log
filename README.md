# construction-log

NestJS, NextJS, PostgreSQL, Drizzle, SWR
Используем docker или podman

```sh
podman compose up -d
# или
podman start postgres-costruct

# убедитесь что контейнер запущен
podman ps

cd backend
# создайте файл .env
npm install
npx drizzle-kit migrate
$ npm run start:dev

cd ../
cd frontend
# создайте файл .env
npm i
npm run dev

```
