import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, RelationId, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';


@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
	
	@Field(type => String)
	@Column()
	transactionId: string;
	
	@Field(type => User, { nullable: true })
	@ManyToOne(
		type => User,
		user => user.payments,
	)
	user?: User;
	
	@RelationId((order: Payment) => order.user)
	userId: number;
	
	@Field(type => Restaurant)
	@ManyToOne(type => Restaurant)
	restaurant: Restaurant;
	
	@Field(type => Int)
	@RelationId((payment: Payment) => payment.restaurant)
	restaurantId: number;
}