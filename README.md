# Проект: NewsExplorer (API)

### О проекте

Бэкенд проекта прото-мессенджера, представляющий собой mvp. На данный момент реализован API пользователя:

- регистрация;
- аутентификация и авторизация;
- получение данных текущего пользователя;
- получение данных определенного пользователя по идентификатору;
- обновление данных пользователя.

Так же реализованы обработки ошибок при некорректных запросах.

### Технологии

TypeScript, Express (Node.js), Prisma, MongoDB

### Инструкция

1. Запустить MongoDB в докере;
2. Запустить команды:


    - npx prisma db push - синхронизация схемы базы данных;
    - npx prisma studio - запускает веб-интерфейс для визуализации и управления данными в вашей базе данных (опционально для визуала).

3. Запустить команды:


    - npm run build - компиляция проекта (финальная сборка);
    - npm run start - запуск скомпилированного приложения;
    - npm run dev - запуск приложения в режиме разработки.

### План по доработке

1. Разработка API для работы с постами, комментариями и подписками;
2. Написание валидации с помощью Joi для всего API;
3. Доработка логирования ошибок;
4. Написание докер-файла для сборки и дальнейшей контейнеризации приложения;
5. Реализация CI. Написание правила для GitHub Actions.

Приятного просмотра!
