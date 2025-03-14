import { Joi } from 'celebrate';

const regexPassword = /[a-zA-Z0-9]{3,30}/;

const idValidation = Joi.string().hex().required().length(24).messages({
  'string.empty': 'Идентификатор не может быть пустым',
  'string.hex':
    'Идентификатор должен содержать только шестнадцатеречные символы',
  'string.length': 'Идентификатор должен содержать ровно 24 символа',
  'any.required': 'Идентификатор пользователя обязателен в параметрах',
});

const checkIdValidation = {
  params: Joi.object().keys({
    id: idValidation,
  }),
};

const registerValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': 'Поле имени не может быть пустым',
      'string.min': 'Минимальное число символов равно 2',
      'string.max': 'Максимальное число символов равно 30',
      'any.required': 'Поле имени обязательно для заполнения',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле адрес электронной почты не может быть пустым',
      'string.email': 'Введите корректный адрес электронной почты',
      'any.required': 'Поле адрес электронной почты обязательно для заполнения',
    }),
    password: Joi.string().required().regex(regexPassword).messages({
      'string.empty': 'Поле пароля не может быть пустым',
      'string.pattern.base': 'Пароль не соответствует требованиям',
      'any.required': 'Поле пароля обязательно для заполнения',
    }),
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле адрес электронной почты не может быть пустым',
      'string.email': 'Введите корректный адрес электронной почты',
      'any.required': 'Поле адрес электронной почты обязательно для заполнения',
    }),
    password: Joi.string().required().regex(regexPassword).messages({
      'string.empty': 'Поле пароля не может быть пустым',
      'string.pattern.base': 'Пароль не соответствует требованиям',
      'any.required': 'Поле пароля обязательно для заполнения',
    }),
  }),
};

const updateUserValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().messages({
      'string.empty': 'Поле адрес электронной почты не может быть пустым',
      'string.email': 'Введите корректный адрес электронной почты',
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.empty': 'Поле имени не может быть пустым',
      'string.min': 'Минимальное число символов равно 2',
      'string.max': 'Максимальное число символов равно 30',
    }),
    dateOfBirth: Joi.date().allow(null, ''),
    bio: Joi.string().allow(null, ''),
    location: Joi.string().allow(null, ''),
  }),
  params: Joi.object().keys({
    id: idValidation,
  }),
};

const createPostValidation = {
  body: Joi.object().keys({
    content: Joi.string().required().messages({
      'string.empty': 'Поле контента не может быть пустым',
      'any.required': 'Поле контента обязательно для заполнения',
    }),
  }),
};

const createCommentValidation = {
  body: Joi.object().keys({
    postId: idValidation,
    content: Joi.string().required().messages({
      'string.empty': 'Поле контента не может быть пустым',
      'any.required': 'Поле контента обязательно для заполнения',
    }),
  }),
};

const likePostValidation = {
  body: Joi.object().keys({
    postId: idValidation,
  }),
};

const followValidation = {
  body: Joi.object().keys({
    followingId: idValidation,
  }),
};

const unfollowValidation = {
  body: Joi.object().keys({
    followingId: idValidation,
  }),
  params: Joi.object().keys({
    id: idValidation,
  }),
};

export {
  checkIdValidation,
  registerValidation,
  loginValidation,
  updateUserValidation,
  createPostValidation,
  createCommentValidation,
  likePostValidation,
  followValidation,
  unfollowValidation,
};
