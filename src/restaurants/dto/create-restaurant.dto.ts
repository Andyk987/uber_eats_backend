import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { IsString, IsBoolean, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
	"name",
	"coverImg",
	"address",
]) {
	
	@Field(type => String)
	categoryName: string;
	
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}