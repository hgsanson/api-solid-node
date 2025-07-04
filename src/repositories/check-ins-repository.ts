import type { CheckIn, Prisma } from "@prisma/client";

export interface CheckInsRepository {
	create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
	save(checkIn: CheckIn): Promise<CheckIn>;
	countByUserId(userId: string): Promise<number>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
	findById(id: string): Promise<CheckIn | null>;
}
