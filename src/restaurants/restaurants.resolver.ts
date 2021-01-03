import { Args, Query, Mutation, Resolver, ResolveField } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Category } from './entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dto/edit-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dto/delete-restaurant.dto';
import { RestaurantService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
	constructor(private readonly restaurantService: RestaurantService) {}

	@Mutation((returns) => CreateRestaurantOutput)
	@Role(["Owner"])
	async createRestaurant(
		@AuthUser() authUser: User,
		@Args('input') createRestaurantInput: CreateRestaurantInput,
	): Promise<CreateRestaurantOutput> {
		return this.restaurantService.createRestaurant(
		authUser,
		createRestaurantInput,
		);
	}

	@Mutation(returns => EditRestaurantOutput)
	@Role(["Owner"])
	async editRestaurant(
		@AuthUser() owner: User,
		@Args('input') editRestaurantInput: EditRestaurantInput
	): Promise<EditRestaurantOutput> {
		return this.restaurantService.editRestaurant(owner, editRestaurantInput);
	}

	@Mutation(returns => DeleteRestaurantOutput)
	@Role(["Owner"])
	async deleteRestaurant(
		@AuthUser() owner: User,
		@Args('input') deleteRestaurantInput: DeleteRestaurantInput
	): Promise<DeleteRestaurantOutput> {
		return this.restaurantService.deleteRestaurant(owner, deleteRestaurantInput);
	}
}

@Resolver(of => Category)
export class CategoryResolver {
	constructor(
		private readonly restaurantService: RestaurantService
	) {}
	
	@ResolveField(type => Int)
	restaurantCount(): number {
		return 80;
	}
	
	@Query(type => AllCategoriesOutput)
	allCategories(): Promise<AllCategoriesOutput> {
		return this.restaurantService.allCategories();
	}
}




