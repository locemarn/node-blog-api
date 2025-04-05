// import { beforeEach, expect, jest } from "@jest/globals"
// import { PrismaClient } from "@prisma/client"
// import "reflect-metadata" // Required for tsyringe
// import { container } from "tsyringe"

// // --- Import necessary classes/interfaces ---
// import { UserRepository } from "./src/domain/repositories/userRepository" // Adjust path
// import { BcryptPasswordHasher } from "./src/infrastructure/cryptography/bcrypt-password-hasher" // Adjust path
// import { IPasswordHasher } from "./src/application/contracts/password-hasher.interface" // Adjust path
// // console.log("--- Jest Test Suite Setup ---")
// // Example: Set a global variable for tests (use with caution)
// // global.myTestVariable = 'Initial Value';

// // Example: Extend Jest's expect
// expect.extend({
//   toBeWithinRange(received: number, floor: number, ceiling: number) {
//     const pass = received >= floor && received <= ceiling
//     if (pass) {
//       return {
//         message: () =>
//           `expected ${received} not to be within range ${floor} - ${ceiling}`,
//         pass: true,
//       }
//     } else {
//       return {
//         message: () =>
//           `expected ${received} to be within range ${floor} - ${ceiling}`,
//         pass: false,
//       }
//     }
//   },
// })

// // Example: Run code before and after all tests in the suite
// // beforeAll(() => {
// //   console.log('Running before all test suites...');
// // });

// // afterAll(() => {
// //   console.log('Running after all test suites...');
// // });

// // --- Create Mocks ---

// // Mock the UserRepository (export it so tests can configure it)
// export const mockUserRepository: jest.Mocked<UserRepository> = {
//   findById: jest.fn(),
//   save: jest.fn(),
//   update: jest.fn(),
//   deleteById: jest.fn(),
//   findByEmail: jest.fn(),
// }

// // --- Mock Prototypes/Implementations ---

// // Mock the hasher's implementation (export spy so tests can configure it if needed, though less common)
// // We spy on the prototype because the instance is created inside the use case constructor
// export const mockPasswordHasherHashSpy = jest
//   .spyOn(BcryptPasswordHasher.prototype, "hash")
//   .mockResolvedValue("hashed_password") // Default mock implementation

// // --- Global Test Hooks ---

// beforeAll(() => {
//   // Register mocks with tsyringe container ONCE before any tests run
//   container.clearInstances() // Start clean
//   container.registerInstance<UserRepository>(
//     "UserRepository",
//     mockUserRepository
//   )

//   // Optional: Register a mock for the hasher interface if something else might inject it
//   // container.register<IPasswordHasher>("PasswordHasher", { useClass: BcryptPasswordHasher });
//   // Note: Since CreateUserUseCase NEWS UP BcryptPasswordHasher directly, spying on the
//   // prototype is the most direct way to intercept its 'hash' method for that specific use case.
//   // If it were injected via constructor (@inject("PasswordHasher")), then registering
//   // a mock instance/factory for "PasswordHasher" would be the way.
// })

// beforeEach(() => {
//   // Reset mocks before each test to ensure isolation
//   jest.clearAllMocks()

//   // Re-apply default mock implementations if needed (clearAllMocks removes them)
//   mockPasswordHasherHashSpy.mockResolvedValue("hashed_password")

//   // Optional: You could reset the container registration here as well if needed,
//   // but clearAllMocks on the mock object itself is usually sufficient for state.
//   // container.clearInstances();
//   // container.registerInstance<UserRepository>('UserRepository', mockUserRepository);
// })

// // Optional: Add afterEach or afterAll for cleanup if necessary
// // afterEach(() => {
// //   container.clearInstances();
// // });
