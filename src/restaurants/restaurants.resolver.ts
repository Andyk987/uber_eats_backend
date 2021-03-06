import { Args, Int, Query, Mutation, Parent, Resolver, ResolveField } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dto/delete-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dto/edit-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dto/search-restaurant.dto';
import { MyRestaurantsOutput } from './dto/my-restaurants.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dto/my-restaurant.dto';
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

	@Query(returns => MyRestaurantsOutput)
	@Role(["Owner"])
	myRestaurants(
		@AuthUser() owner: User
	): Promise<MyRestaurantsOutput> {
		return this.restaurantService.myRestaurants(owner);
	}

	@Query(returns => MyRestaurantOutput)
	@Role(["Owner"])
	myRestaurant(
		@AuthUser() owner: User,
		@Args('input') myRestaurantInput: MyRestaurantInput,
	): Promise<MyRestaurantOutput> {
		return this.restaurantService.myRestaurant(owner, myRestaurantInput);
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

	@Query(returns => RestaurantsOutput)
	restaurants(
		@Args('input') restaurantsInput: RestaurantsInput,
	): Promise<RestaurantsOutput> {
		return this.restaurantService.allRestaurants(restaurantsInput)
	}

	@Query(returns => RestaurantOutput)
	restaurant(
		@Args('input') restaurantInput: RestaurantInput,
	): Promise<RestaurantOutput> {
		return this.restaurantService.findRestaurantById(restaurantInput);
	}

	@Query(returns => SearchRestaurantOutput)
	searchRestaurant(
		@Args('input') searchRestaurantInput: SearchRestaurantInput,
	): Promise<SearchRestaurantOutput> {
		return this.restaurantService.searchRestaurantByName(searchRestaurantInput);	
	}
}

@Resolver(of => Category)
export class CategoryResolver {
	constructor(
		private readonly restaurantService: RestaurantService
	) {}
	
	@ResolveField(type => Int)
	restaurantCount(@Parent() category: Category): Promise<number> {
		return this.restaurantService.countRestaurants(category);
	}
	
	@Query(type => AllCategoriesOutput)
	allCategories(): Promise<AllCategoriesOutput> {
		return this.restaurantService.allCategories();
	}

	@Query(type => CategoryOutput)
	category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
		return this.restaurantService.findCategoryBySlug(categoryInput);
	}
}

@Resolver(of => Dish)
export class DishResolver {
	constructor(
		private readonly dishService: RestaurantService
	)  {}
	
	@Mutation(type => CreateDishOutput)
	@Role(["Owner"])
	createDish(
		@AuthUser() owner: User,
		@Args('input') createDishInput: CreateDishInput,
	): Promise<CreateDishOutput> {
		return this.dishService.createDish(owner, createDishInput)
	}

	@Mutation(type => DeleteDishOutput)
	@Role(["Owner"])
	DeleteDish(
		@AuthUser() owner: User,
		@Args('input') deleteDishInput: DeleteDishInput,
	): Promise<DeleteDishOutput> {
		return this.dishService.deleteDish(owner, deleteDishInput)
	}

	@Mutation(type => EditDishOutput)
	@Role(['Owner'])
	editDish(
		@AuthUser() owner: User,
		@Args('input') editDishInput: EditDishInput,
	): Promise<EditDishOutput> {
		return this.dishService.editDish(owner, editDishInput)
	}
}




