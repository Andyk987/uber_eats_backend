import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, RelationId, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';

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
		category => category.restaurats,
		{ nullable: true, onDelete: 'SET NULL' },
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
}