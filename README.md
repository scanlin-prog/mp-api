# Проект: MP-api

### О проекте

MVP разработка прото-мессенджера, представляющего API для управления пользовательскими данными и контентом. На данный момент реализованы:
- Регистрация, аутентификация и авторизация пользователей;
- Доступ к данным текущего пользователя и информация о пользователе по его уникальному идентификатору;
- Обновление информации профиля пользователя;
- Операции по получению, созданию и удалению постов;
- Функционал для написания комментариев под постами и проставления лайков;
- Возможность пользователям подписываться друг на друга.

Так же реализованы:
- Валидация запросов;
- Сбор логов в процессе обработки запросов и ошибок;
- Статический анализ кода с помощью ESLint в сочетании с форматировщиком Prettier;
- Конфигурации для сборки образа проекта и его запуска в контейнерах.

### Технологии

- TypeScript,
- Express (Node.js),
- Prisma,
- MongoDB,
- Docker (Docker Compose),
- Eslint,
- Prettier.

### Инструкция
1. Установить wsl и Docker Desktop;

2. Локальный запуск приложения:
    - Выполнить действия из раздела "Работа с Docker";
    - Скачать проект с репозитория и установить пакеты командой:
        - npm i;
    - Создать файл .env. Перенести переменные из соответствующего раздела .env.local в .env. 
    В DATABASE_URL вместо bobby и cat задать username и password, что были заданы контейнеру БД (если их меняли).
    - Установить утилиту prisma глобально:
        - npm install -g prisma
    - Сгенерировать Prisma Client:
        - prisma generate --schema=src/prisma/schema.prisma (если генерация запускается на уровне директории prisma, то флаг не нужен);
    - Основные команды для работы:
        - npm run build - компиляция проекта (включает и статический анализ с помощью линтера);
        - npm run start:dev - запуск скомпилированного приложения;
        - npm run dev - запуск приложения в режиме разработки.
    - Дополнительные команды:
        - npx prisma db push - синхронизация схемы базы данных с фактической базой данных (при изменениях в schema.prisma или применении миграций);
        - npx prisma studio - запускает веб-интерфейс для визуализации и управления данными в вашей базе данных (опционально для визуализации);
        - npm run lint - запускает линтер для статического анализа кода.

ИЛИ

2. Поднятие приложения и базы данных в Docker:
    - Создать файлы express.env и db.env. Перенести переменные из соответствующих разделов .env.local в express.env и db.env. 
    В db.env заданы username и password по умолчанию, их можно заменить.
    Тогда в express.env в DATABASE_URL вместо bobby и cat задать соответствующие username и password.
    - Выполнить пункт 1 из раздела "Работа с Docker";
    - Создать и запустить контейнеры:
        - docker compose up - создает (если нет контейнеров) и запускает контейнеры.
    - В дальнейшем использовать команды:
        - docker compose start/stop - запускает/останавливает работу связанных контейнеров;
    - Если конфигурационный файл меняется, то запускать команду:
        - docker compose up

    * Базовые команды смотреть в пункте 4 раздела "Работа с Docker"

#### Работа с Docker
1. Скачать образ базы данных;
    - docker pull prismagraphql/mongo-single-replica:5.0.3 - загружает образ MongoDB из DockerHub;
2. Запустить контейнер:
    - docker run --name mongo \
       -p 27017:27017 \
       -e MONGO_INITDB_ROOT_USERNAME="<username>" \
       -e MONGO_INITDB_ROOT_PASSWORD="<password>" \
       -d prismagraphql/mongo-single-replica:5.0.3
3. Основные команды для работы с созданным контейнером:
    - docker start mongo - указывается имя контейнера, заданное в пункте 2 флагом --name.
    - docker stop mongo - останавливает работу именного контейнера mongo.
    * Примечание: Можно запустить сразу вторую команду, тогда автоматически скачается образ, создастся и запустится контейнер с переданными параметрами:
        * --name - задает имя для нового контейнера;
        * -p - настраивает проброс портов с контейнера на локальный хост (слева - порт для основного устройства, справа - порт внутри контейнера);
        * -e - задает переменную окружения для контейнера
        * -d - запуск контейнера в фоновом режиме
4. (Опционально) Основные команды для работы с docker-compose:
    - docker compose create - создает контейнеры по конфигурации файла docker-compose.yml;
    - docker compose up - создает и запускает созданные, связанные контейнеры;
    - docker compose down - останавливает работу и удаляет все контейнеры работу связанных контейнеров, сети и тома;
    - docker compose up/down <name> - создает/удаляет и запускает/останавливает или просто запускает/останавливает работу заданного по имени контейнера;
    - docker compose start/stop - запускает/останавливает работу связанных контейнеров;
    - docker compose start/stop <name> - запускает/останавливает работу заданного по имени контейнера.

* В проекте используются username=bobby и password=cat по умолчанию. Если были заданы свои, смотреть пункт 2 в инструкции по локальному запуску приложения.

### План по модернизации и оптимизации

1. Установить сборщик проекта (Webpack или Vite) и написать конфигурацию;
2. Переписать контроллеры в классы;
3. Написать необходимые тесты с помощью Jest;
4. Доработать логику сборки образов и контейнерезации с учетом разделения на области development и production;
5. Реализовать CI. Написать конфигурацию для GitHub Actions.
