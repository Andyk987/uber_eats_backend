import { Injectable, Inject } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtModuleOptions } from './jwt.interfaces';
export const CONFIG_OPTIONS = "CONFIG_OPTIONS";

@Injectable()
export class JwtService {
	constructor(
	@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
	) {}
	
	sign(userId: number): string {
		return jwt.sign({ id: userId }, this.options.privateKey);
	}

	verify(token: string) {
		return jwt.verify(token, this.options.privateKey);
	}
}
