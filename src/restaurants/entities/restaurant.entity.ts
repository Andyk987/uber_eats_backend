import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, RelationId, OneToMany, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';

@InputType("RestaurantInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
	
	@Field(type => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;
	
	@Field(type => String)
	@Column()
	@IsString()
	coverImg: string;
	
	@Field(type => String, { defaultValue: '강남' })
	@Column()
	@IsString()
	address: string;
	
	@Field(type => Category, { nullable: true })
	@ManyToOne(
		type => Category,
		category => category.restaurants,
		{ nullable: true, onDelete: 'SET NULL', eager: true },
	)
	category: Category;
	
	@Field(type => User, { nullable: true })
	@ManyToOne(
		type => User,
		user => user.restaurants,
		{ onDelete: "CASCADE" },
	)
	owner: User;
	
	@RelationId((restaurant: Restaurant) => restaurant.owner)
	ownerId: number;
	
	@Field(type => [Order])
	@OneToMany(
		type => Order,
		order => order.restaurant,
	)
	orders: Order[];
	
	@Field(type =>[Dish], { nullable: true })
	@OneToMany(
		type => Dish,
		dish => dish.restaurant,
		{ nullable: true, eager: true }
	)
	menu: Dish[];
	
	@Field(type => Boolean)
	@Column({ default: false })
	isPromoted: boolean;
	
	@Field(type => Date, { nullable: true })
	@Column({ nullable: true })
	promotedUntil: Date;
	
}






	
	
	
	