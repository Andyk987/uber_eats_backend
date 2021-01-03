import { UseGuards } from '@nestjs/common';
import { Args, Context, Resolver, Query, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';

@Resolver(of => User)
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}
	
	@Mutation(returns => CreateAccountOutput)
	async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
		return this.usersService.createAccount(createAccountInput);
	}
	
	@Mutation(retruns => LoginOutput)
	async login(@Args('input') loginInput: LoginInput ): Promise<LoginOutput> {
		return this.usersService.login(loginInput);
	}
	
	@Query(returns => User)
	@Role(['Any'])
	@UseGuards(AuthGuard)
	me(@AuthUser() authUser: User) {
		return authUser;
	}
	
	@UseGuards(AuthGuard)
	@Role(['Any'])
	@Query(returns => UserProfileOutput)
	async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
		return this.usersService.findById(userProfileInput.userId);
	}
	
	@UseGuards(AuthGuard)
	@Role(['Any'])
	@Mutation(returns => EditProfileOutput)
	async editProfile(@AuthUser() authUser: User, @Args('input') editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
		return this.usersService.editProfile(authUser.id, editProfileInput);
	}
	
	@Mutation(returns => VerifyEmailOutput)
	verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
		return this.usersService.verifyEmail(code);
	}
}




