import "reflect-metadata"
import { PostRepository } from "../../../ports/postRepository"
import { CreatePostInput, CreatePostUseCase } from "../createPostUseCase"
import { ValidationError } from "../../../../utils/fixtures/errors/ValidationError"
import { PostAuthorIdIsRequiredError } from "../../../../domain/entities/post.entity"
import { AppError } from "../../../../utils/fixtures/errors/AppError"

// Mock the repositories
const mockPostRepository: jest.Mocked<PostRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  deleteById: jest.fn(),
}
// const mockUserRepository: jest.Mocked<IUserRepository> = {
//   findById: jest.fn(),
//   save: jest.fn(), // Add other methods as needed
//   findByEmail: jest.fn(),
// };

const validCreatePostInput: CreatePostInput = {
  title: "Test Post",
  content: "Test Content",
  authorId: 1,
}

describe("CreatePostUseCase", () => {
  let createPostUseCase: CreatePostUseCase
  // let postRepository: jest.Mocked<PostRepository>

  beforeEach(() => {
    jest.clearAllMocks()

    // createPostUseCase = new CreatePostUseCase(mockPostRepository, mockUserRepository)
    createPostUseCase = new CreatePostUseCase(mockPostRepository)
  })

  describe("execute", () => {
    it("should create and save a post successfully", async () => {
      // Arrange
      const input: CreatePostInput = {
        ...validCreatePostInput,
      }

      // const mockAuthor = User.create({ name: 'Test User', email: 'test@test.com', passwordHash: 'xxx' }, 'user-123');
      // mockUserRepository.findById.mockResolvedValue(mockAuthor); // Simulate author found

      // Act
      const result = await createPostUseCase.execute(input)

      // Assert
      expect(result).toBeDefined()
      expect(result.title).toBe(input.title)
      expect(result.content).toBe(input.content)
    })

    it("should throw a ValidationError if title is empty", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
        title: "",
      }

      await expect(createPostUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should throw a ValidationError if content is empty", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
        content: "",
      }

      await expect(createPostUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should throw a ValidationError if authorId is not provided", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
        authorId: undefined as unknown as number,
      }

      await expect(createPostUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should throw a ValidationError if authorId is negative", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
        authorId: -1,
      }

      await expect(createPostUseCase.execute(input)).rejects.toThrow(
        ValidationError
      )
    })

    it("should throw a ValidationError if authorId is zero", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
        authorId: 0,
      }

      await expect(createPostUseCase.execute(input)).rejects.toThrow(
        PostAuthorIdIsRequiredError
      )
    })

    it("should throw a ValidationError if authorId is not a number", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
        authorId: "not a number" as unknown as number,
      }

      await expect(createPostUseCase.execute(input)).rejects.toThrow(
        PostAuthorIdIsRequiredError
      )
    })

    it("should return an AppError if the post is not saved", async () => {
      const input: CreatePostInput = {
        ...validCreatePostInput,
      }

      mockPostRepository.save.mockRejectedValue(
        new AppError("Failed to save the post due to a persistence issue.", 500)
      )

      await expect(createPostUseCase.execute(input)).rejects.toThrow(AppError)
    })
  })
})
