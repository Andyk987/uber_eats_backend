import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Raw } from 'typeorm';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { User } from 'src/users/entities/user.entity';
import { Restaurant } from './entities/restaurant.entity';
import { AllCategoriesOutput } from './dto/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dto/category.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dto/create-restaurant.dto';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dto/edit-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dto/delete-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';
import { RestaurantsInput, RestaurantsOutput } from './dto/restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dto/restaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dto/search-restaurant.dto';
import { MyRestaurantsOutput } from './dto/my-restaurants.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dto/my-restaurant.dto';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
	constructor(
		@InjectRepository(Restaurant)
		private readonly restaurants: Repository<Restaurant>,
		@InjectRepository(Dish)
		private readonly dishes: Repository<Dish>,
		private readonly categories: CategoryRepository,
	) {}

	async createRestaurant(
		owner: User,
		createRestaurantInput: CreateRestaurantInput
	): Promise<CreateRestaurantOutput> {
		try {
			const newRestaurant = this.restaurants.create(createRestaurantInput);
			newRestaurant.owner = owner;
			const category = await this.categories.getOrCreate(
				createRestaurantInput.categoryName,
				createRestaurantInput.coverImg
			)
			newRestaurant.category = category;
			await this.restaurants.save(newRestaurant);
			return {
				ok: true,
				restaurantId: newRestaurant.id,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not create restaurant',
			};
		}
	}

	async editRestaurant(
		owner: User,
		editRestaurantInput: EditRestaurantInput
	): Promise<EditRestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne(
				editRestaurantInput.restaurantId,
				{ loadRelationIds: true },
			);
			if(!restaurant) {
				return {
					ok: false,
					error: "Restaurant not found",
				};
			}
			if(owner.id !== restaurant.ownerId) {
				return {
					ok: false,
					error: "You can't edit a restaurant that you don't own",
				};
			}
			
			let category: Category = null;
			if(editRestaurantInput.categoryName) {
				category = await this.categories.getOrCreate(
					editRestaurantInput.categoryName,
					editRestaurantInput.coverImg
				)
			}
			await this.restaurants.save([
				{
					id: editRestaurantInput.restaurantId,
					...editRestaurantInput,
					...(category && { category }),
				}
			])
			return {
				ok: true
			}
		} catch {
			return {
				ok: false,
				error: "Could not edit Restaurant"
			}
		}
	}
	
	async deleteRestaurant(
		owner: User,
		{ restaurantId }: DeleteRestaurantInput
	): Promise<DeleteRestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne(
				restaurantId,
				{ loadRelationIds: true },
			);
			if(!restaurant) {
				return {
					ok: false,
					error: "Restaurant not found",
				};
			}
			if(owner.id !== restaurant.ownerId) {
				return {
					ok: false,
					error: "You can't delete a restaurant that you don't own",
				};
			}
			await this.restaurants.delete(restaurantId);
			return {
				ok: true,
			}
		} catch {
			return {
				ok: false,
				error: "Could not edit Restaurant"
			}
		}
	}
	
	async allCategories(): Promise<AllCategoriesOutput> {
		try {
			const categories = await this.categories.find();
			return {
				ok: true,
				categories,
			};
		} catch {
			return {
				ok: false,
				error: "Could not load categories",
			}
		}
	}
	
	countRestaurants(category: Category) {
		return this.restaurants.count({ category });
	}
	
	async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
		try {
			const category = await this.categories.findOne({ slug });
			if(!category) {
				return {
					ok: false,
					error: "Category not found",
				}
			}
			const restaurants = await this.restaurants.find({
				where: {
					category,
				},
				order: {
					isPromoted: 'DESC',
				},
				take: 3,
				skip: (page - 1) * 3,
			});
			category.restaurants = restaurants;
			const totalResults = await this.countRestaurants(category);
			return {
				ok: true,
				restaurants,
				category,
				totalPages: Math.ceil(totalResults / 3),
				totalResults,
			}
		} catch {
			return {
				ok: false,
				error: "Could not load category",
			}
		}
	}
	
	async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
		try {
			const [ restaurants, totalResults ] = await this.restaurants.findAndCount({
				skip: (page - 1) * 3,
				take: 3,
				order: {
				  isPromoted: 'DESC',
				},
				relations: ['orders'],
			});
			return {
				ok: true,
				results: restaurants,
				totalPages: Math.ceil(totalResults / 3),
				totalResults,
			};
		} catch {
			return {
				ok: false,
				error: "Could not load restaurants",
			}
		}
	}
	
	async findRestaurantById({ restaurantId }: RestaurantInput): Promise<RestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne(restaurantId, { relations: ['menu', 'category', 'owner'], });
			if(!restaurant) {
				return {
					ok: false,
					error: "Restaurant not found",
				}
			}
			return {
				ok: true,
				restaurant,
			}
		} catch {
			return {
				ok: false,
				error: "Could not find restaurant",
			}
		}
	}
	
	async searchRestaurantByName({ query, page }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
		try {
			const [restaurants, totalResults] = await this.restaurants.findAndCount({
				where: {
					name: Raw(name => `${name} ILIKE '%${query}%'`),
				},
				skip: (page - 1) * 3,
				take: 3,
			});
			return {
				ok: true,
				restaurants,
				totalResults,
				totalPages: Math.ceil(totalResults / 3),
			}
		} catch {
			return {
				ok: false,
				error: "Could not search for restaurants",
			}
		}
	}

	async createDish(
		owner: User,
		createDishInput: CreateDishInput,
	): Promise<CreateDishOutput> {
		try {
			const restaurant = await this.restaurants.findOne(
				createDishInput.restaurantId,
			);
			if(!restaurant) {
				return {
					ok:  false,
					error: "Could not found restaurant"
				}
			}
			if(owner.id !== restaurant.ownerId) {
				return {
					ok: false,
					error: "You are not allowed to create dish"
				}
			}
			await this.dishes.save(
				this.dishes.create({ ...createDishInput, restaurant })
			)
			return {
				ok: true,
			}
		} catch {
			return {
				ok: false,
				error: "Could not create dish",
			}
		}
	}

	async deleteDish(
		owner: User,
		{ dishId }: DeleteDishInput,
	): Promise<DeleteDishOutput> {
		try {
			const dish = await this.dishes.findOne(dishId, { relations: ['restaurant'] });
			if(!dish) {
				return {
					ok: false,
					error: "Could not find dish",
				}
			}
			if(dish.restaurant.ownerId !== owner.id) {
				return {
					ok: false,
					error: "Your are not allowed to deleteDish",
				}
			}
			await this.dishes.delete(dishId);
			return {
				ok: true,
			}
		} catch {
			return {
				ok: false,
				error: "Could not delete dish",
			}
		}
	}

	async editDish(
		owner: User,
		editDishInput: EditDishInput,
	): Promise<EditDishOutput> {
		try {
			const dish = await this.dishes.findOne(editDishInput.dishId, {
				relations: ['restaurant'],
			});
			if (!dish) {
				return {
					ok: false,
					error: 'Dish not found',
				};
			}
			if (dish.restaurant.ownerId !== owner.id) {
				return {
					ok: false,
					error: "You can't do that.",
				};
			}
			await this.dishes.save([
				{
					id: editDishInput.dishId,
					...editDishInput,
				},
			]);
			return {
				ok: true,
			};
		} catch {
			return {
				ok: false,
				error: 'Could not delete dish',
			};
		}
	}

	async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
		try {
			const restaurants = await this.restaurants.find({ owner });
			return {
				restaurants,
				ok: true,
			};
		} catch {
			return {
				ok: false,
				error: "Could not find restaurants.",
			};
		}
	}

	async myRestaurant(
		owner: User,
		{ id }: MyRestaurantInput,
	): Promise<MyRestaurantOutput> {
		try {
			const restaurant = await this.restaurants.findOne(
				{ owner, id },
				{ relations: ['menu', 'orders'] },
			);
			return {
				restaurant,
				ok: true,
			};
		} catch {
			return {
				ok: false,
				error: "Could not find restaurants",
			};
		}
	}
}