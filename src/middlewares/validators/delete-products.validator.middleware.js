import Joi from 'joi';

export const deleteProductValidator = async (req, res, next) => {
  try {
    const joiSchema = Joi.object({
      password: Joi.string().required().messages({
        'string.base': '비밀번호는 문자열이어야 합니다.', 
        'any.required' : '비밀번호를 입력해 주세요.'
      }),
    });
    await joiSchema.validateAsync(req.body);
    next();
  }catch(error) {
    next(error);
  }
};