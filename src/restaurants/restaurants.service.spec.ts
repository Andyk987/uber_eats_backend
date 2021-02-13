import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { Dish } from './entities/dish.entity';
import { CategoryRepository } from './repositories/category.repository';

const mockRepository = () => ({
	find: jest.fn(),
	findOne: jest.fn(),
	findAndCount: jest.fn(),
	save: jest.fn(),
	create: jest.fn(),
	getOrCreate: jest.fn(),
	delete: jest.fn(),
	
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('RestaurantService', () => {
	
	let service: RestaurantService;
	let restaurantsRepository: MockRepository<Restaurant>;
	let dishesRepository: MockRepository<Dish>;
	let categoriesRepository: CategoryRepository;
	
	beforeEach(async () => {
		
		const module = await Test.createTestingModule({
			providers: [
				RestaurantService,
				{
					provide: getRepositoryToken(Restaurant),
					useValue: mockRepository(),
				},
				{
					provide: getRepositoryToken(Dish),
					useValue: mockRepository(),
				},
				{
					provide: getRepositoryToken(CategoryRepository),
					useValue: mockRepository(),
				}
			],
		}).compile();
		service = module.get<RestaurantService>(RestaurantService);
		restaurantsRepository = module.get(getRepositoryToken(Restaurant));
		dishesRepository = module.get(getRepositoryToken(Dish));
		categoriesRepository = module.get(getRepositoryToken(CategoryRepository));
	});
		
	it('should be defined', () => {
		expect(service).toBeDefined();
	})
					
	describe('createRestaurant', () => {
		const createRestaurantArgs = {
			name: "",
			coverImg: "",
			address: "",
			categoryName: "",
		};
					
		
		it("should create a new restaurant", async () => {
			const mockedUser = {
				id: 0,
				email: "test@test.com",
				role: 0,
			};
			
			restaurantsRepository.create.mockReturnValue(createRestaurantArgs);
				
			categoriesRepository.getOrCreate.mockResolvedValue(createRestaurantArgs.categoryName);
			
			restaurantsRepository.save.mockResolvedValue(createRestaurantArgs);
			
			const result = await service.createRestaurant(mockedUser, createRestaurantArgs);
			
			expect(restaurantsRepository.create).toHaveBeenCalledTimes(1);
			expect(result).toEqual({ ok: true });
		})
	})
		
	it.todo('editRestaurant');
	it.todo('deleteRestaurant');
	it.todo('allCategories');
	it.todo('countRestaurants');
	it.todo('findCategoryBySlug');
	it.todo('allRestaurants');
	it.todo('findRestaurantById');
	it.todo('searchRestaurantByName');
	it.todo('createDish');
	it.todo('deleteDish');
	it.todo('editDish');
})