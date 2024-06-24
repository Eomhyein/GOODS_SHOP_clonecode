import mongoose from 'mongoose';
// TODO: .env 파일 사용을 위해서는 여기에 패키지 import가 필요합니다.
import { MONGODB_NAME, MONGODB_URL } from '../constants/env.constant.js';

const connect = () => {
  // mongoose.connect는 MongoDB 서버에 연결하는 메서드입니다.
  mongoose
    .connect(
      process.env.MONGODB_URL,
      {
        dbName: process.env.MONGODB_NAME
      },
    )
    .then(() => console.log('MongoDB 연결에 성공하였습니다.'))
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

export {connect};