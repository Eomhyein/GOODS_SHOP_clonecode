import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../constants/product.constant.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // select: false로 설정하면 find()나 findOne() 등에서 password field를 제외
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(PRODUCT_STATUS), // enum: Object.values(PRODUCT_STATUS)로 status field의 enum을 PRODUCT_STATUS object
    default: PRODUCT_STATUS.FOR_SALE, // 기본값은 FOR_SALE
  },},
  { timestamps: true, toJSON: { virtuals : true }},
);

export const Product = mongoose.model("Product", productSchema);