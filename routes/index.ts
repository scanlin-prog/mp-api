import { Router } from 'express';
import multer from 'multer';
import UserController from '@controllers/users';
import authenticateToken from "middlewares/auth";

import postsRoutes from '@routes/posts';
import commentsRoutes from '@routes/comments';

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

router.use('/', postsRoutes)  // Маршруты постов
router.use('/', commentsRoutes)  // Маршруты комментариев

export default router;