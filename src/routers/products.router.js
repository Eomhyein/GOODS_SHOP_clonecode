import express from 'express';
import { Product } from '../schemas/product.schema.js';
import { createProductValidator } from '../middlewares/validators/create-products.validators.middleware.js';
import { updateProductValidator } from '../middlewares/validators/update-products.validators.middleware.js';
import { deleteProductValidator } from '../middlewares/validators/delete-products.validator.middleware.js'

const productsRouter = express.Router();
// 상품 생성 (CREATE)
productsRouter.post('/products', createProductValidator ,async (req, res, next) => {
  try {  
    // 상품 정보 파싱하기
    // 상품명, 상품 설명, 담당자, 비밀번호
    const { name, description, manager, password } = req.body;

    // DB에서 조회하기
    const existedProduct = await Product.findOne({name});


    // 에러처리, 이미 등록된 상품일 경우
    if (existedProduct) {
      return res
      .status(400)
      .json({status:400, message: '이미 등록 된 상품입니다.'});
    }
    // DB에 저장하기
    const product = new Product({ name, description, manager, password });
    let data = await product.save();

    data = {...data.toJSON(), password: undefined}; // 필요한 데이터만 가져온다, 비밀번호는 가져오지 않는다.
    // 완료 메세지 반환하기
    // 201 : 상품 생성에 성공했습니다.
    return res
      .status(201)
      .json({ status: 201, message: '상품 생성에 성공했습니다.', data });
  } catch(error) {
    next(error); 
  }
});

// 상품 목록 조회 (READ)
productsRouter.get('/products', async (req, res, next) => {
  try {
  // DB에서 조회하기 (생성일시 기준 내림차순 정렬)
  const data = await Product.find().sort({createdAt: 'desc'}).exec();
  // 완료 메세지 반환하기
  return res
  .status(200)
  .json({status:200, message: '상품 목록 조회에 성공했습니다.', data})
  }catch(error) {
    next(error); 
  }
});

// 상품 상세 조회 (READ)
productsRouter.get('/products/:id', async (req, res, next) => {
  try {
  // 상품 ID 파싱하기
  const {id} = req.params;
  // DB에서 조회하기 
  const data = await Product.findById(id).exec();

  // 에러처리, 상품이 존재하지 않을 때 
  if (!data){
    return res
      .status(404)
      .json({status:404, message: '상품이 존재하지 않습니다.'});
  }
  // 완료 메세지 반환하기
  return res
  .status(200)
  .json({status:200, message: '상품 상세 조회에 성공했습니다.', data})
  } catch (error){
    next(error);
  }
});

// 상품 수정 (UPDATE)
productsRouter.put('/products/:id', updateProductValidator, async (req, res, next) => {
  try {
    // 상품 ID 파싱하기
  const {id} = req.params;
  // 상품 수정 정보 파싱하기
  const {name, description, status, manager, password} = req.body;
  // DB에서 조회하기 (패스워드 포함)
  const existedProduct = await Product.findById(id, {password: true}).exec();

  // 에러처리, 상품이 존재하지 않을 때 
  if (!existedProduct){
    return res
      .status(404)
      .json({status:404, message: '상품이 존재하지 않습니다.'});
  }

  // 비밀번호 일치 여부 확인
  const isPasswordMatched = password === existedProduct.password;
  if (!isPasswordMatched) {
    return res
    .status(401).
    json({ status: 401, message: '비밀번호가 일치하지 않습니다.' });
  }
  
  const productInfo = {
    ...(name && { name }),
    ...(description && { description }),
    ...(status && { status }),
    ...(manager && { manager }), // ...은 필요한 부분만 꺼낸다.
  }
  // DB 갱신하기
  const data = await Product.findByIdAndUpdate(id, productInfo, {new: true});
  // 완료 메세지 반환하기
  return res
  .status(200)
  .json({status:200, message: '상품 수정에 성공했습니다.', data})
  } catch(error) {
    next(error);
  }
  }
);

// 상품 삭제 (DELETE)
productsRouter.delete('/products/:id', deleteProductValidator, async (req, res, next) => {
  try {
    // 상품 ID 파싱하기
  const {id} = req.params;
  // 상품 패스워드 파싱하기
  const {password} = req.body;
  // DB에서 조회하기 (패스워드 포함)
  const existedProduct = await Product.findById(id, {password: true}).exec();

  // 에러처리, 상품이 존재하지 않을 때 
  if (!existedProduct){
    return res
      .status(404)
      .json({status:404, message: '상품이 존재하지 않습니다.'});
  }

  // 비밀번호 일치 여부 확인
  const isPasswordMatched = password === existedProduct.password;
  if (!isPasswordMatched) {
    return res
    .status(401).
    json({ status: 401, message: '비밀번호가 일치하지 않습니다.' });
  }
  
  // DB 삭제하기
  const data = await Product.findByIdAndDelete(id);
  // 완료 메세지 반환하기
  return res
  .status(200)
  .json({status:200, message: '상품 삭제에 성공했습니다.', data})
  } catch (error) {
    next(error);
  }
});

export { productsRouter };
