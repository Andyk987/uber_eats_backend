import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './orders.service';
import { OrderResolver } from './orders.resolver';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Order, OrderItem, Dish, Restaurant])],
	providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
