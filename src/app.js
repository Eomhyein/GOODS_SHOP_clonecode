import express from 'express'; // express 라이브러리 들어옴
import { SERVER_PORT } from './constants/env.constant.js';
import { productsRouter } from './routers/products.router.js';
import {connect} from './schemas/index.js';
import {errorHandler} from './middlewares/error-handler.middleware.js';

connect();

const app = express();

app.use(express.json()); // express.json() middleware를 app.use()로 등록합니다
app.use(express.urlencoded({ extended: true })); // express.urlencoded() middleware를 app.use

app.use('/api', productsRouter); // productsRouter를 /api/products 경로
app.use(errorHandler); // errorHandler middleware를 app.use()로 등록합니다

// 서버시작 : Express.js는 지정된 포트 번호를 사용하여 서버를 시작합니다.
app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on ${SERVER_PORT}`);
});
