import { Router } from 'express';
import multer from 'multer';
import UserController from '@controllers/users';
import authenticateToken from "middlewares/auth";

import postsRouter from '@routes/posts';
import commentsRouter from '@routes/comments';
import likesRouter from '@routes/likes';
import followsRouter from '@routes/follows';

const router = Router();

const uploadDestionation = 'uploads'

// Показываем, где хранить файлы
const storage = multer.diskStorage({
    destination: uploadDestionation,
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

const uploads = multer({ storage: storage })

// Маршруты пользователя
router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(authenticateToken)

router.get('/current', UserController.getCurrentUser)
router.get('/users/:id', UserController.getUserById)
router.patch(
    '/users/:id', 
    uploads.single('avatar'), 
    UserController.updateUser
)

router.use('/', postsRouter)  // Маршруты постов
router.use('/', commentsRouter)  // Маршруты комментариев
router.use('/', likesRouter)  // Маршруты лайков
router.use('/', followsRouter)  // Маршруты подписок

export default router;