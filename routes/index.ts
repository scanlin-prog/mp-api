import { Router } from 'express';
import multer from 'multer';
import { UserController } from '@controllers/index';
import authenticateToken from "middlewares/auth";

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

export default router;