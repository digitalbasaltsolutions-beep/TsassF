import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { Order } from './schemas/order.schema';

@Injectable()
export class EcommerceService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Order.name) private orderModel: Model<Order>
  ) {}

  // --- Products ---
  async getProducts() {
    return this.productModel.find().exec();
  }

  async createProduct(data: any) {
    return this.productModel.create(data);
  }

  // --- Orders ---
  async getOrders() {
    return this.orderModel.find().populate('customer', 'name email').populate('products', 'title price').exec();
  }

  async createOrder(data: any) {
    return this.orderModel.create(data);
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
