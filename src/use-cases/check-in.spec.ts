import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "Node Academy",
			description: "",
			phone: "",
			latitude: new Decimal(0),
			longitude: new Decimal(0),
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice in the same day", async () => {
		vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should not be able to check in twice but in different day", async () => {
		vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			title: "Node Academy",
			description: "",
			phone: "",
			latitude: new Decimal(-27.0747279),
			longitude: new Decimal(-49.4889672),
		});

		await expect(() =>
			sut.execute({
				gymId: "gym-02",
				userId: "user-01",
				userLatitude: -27.2092052,
				userLongitude: -49.6401091,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
