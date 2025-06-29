import type { UserRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import type { User } from "@prisma/client";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface registerUserCaseResponse {
	user: User;
}

export class RegisterUseCase {
	constructor(private usersRepository: UserRepository) {}

	async execute({
		name,
		email,
		password,
	}: RegisterUseCaseRequest): Promise<registerUserCaseResponse> {
		const password_hash = await hash(password, 6);

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		});

		return { user };
	}
}
