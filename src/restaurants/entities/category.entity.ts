import { CoreEntity } from 'src/common/entities/core.entity';
import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType("CategoryInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
	
	@Field(type => String)
	@Column({ unique: true })
	@IsString()
	@Length(5)
	name: string;
	
	@Field(type => String, { nullable: true })
	@Column({ nullable: true })
	@IsString()
	coverImg: string;
	
	@Field(type => String)
	@Column({ unique: true })
	@IsString()
	slug: string;
	
	@Field(type => [Restaurant], { nullable: true })
	@OneToMany(
		type => Restaurant,
		restaurant => restaurant.category,
	)
	restaurats: Restaurant[];
}