import Joi from 'joi';
import {PRODUCT_STATUS} from '../../constants/product.constant.js'

export const updateProductValidator = async (req, res, next) => {
  try {
    // joi이용 유효성검사
    const joiSchema = Joi.object({
      name: Joi.string().messages({
        'string.base': '상품명은 문자열이어야 합니다.', 
      }),
      description: Joi.string().messages({
        'string.base': '상품설명은 문자열이어야 합니다.', 
      }),
      status: Joi.string()
        .valid(...Object.values(PRODUCT_STATUS))
        .messages({
          'string.base': '상품 상태는 문자열이어야 합니다.',
          'any.only': '상품 상태는 [FOR_SALE,SOLD_OUT] 중 하나여야 합니다.',
        }),
      manager: Joi.string().messages({
        'string.base': '담당자는 문자열이어야 합니다.', 
      }),
      password: Joi.string().required().messages({
        'string.base': '비밀번호는 문자열이어야 합니다.',
        'any.required': '비밀번호를 입력해 주세요.',
      }),
    });
    await joiSchema.validateAsync(req.body); // joi schema validation
    next();
  } catch(error){
    next(error);
  }
};