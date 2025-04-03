import { injectable, inject } from "tsyringe"
import { PostRepository } from "../../ports/postRepository"
import { Post, PostStatus } from "../../../domain/entities/post.entity"
import { AppError } from "../../../utils/fixtures/errors/AppError"
import { ValidationError } from "../../../utils/fixtures/errors/ValidationError"

export interface CreatePostInput {
  title: string
  content: string
  authorId: number
}

@injectable() // Decorator for DI container
export class CreatePostUseCase {
  constructor(
    @inject("PostRepository")
    private postRepository: PostRepository
  ) {}

  /**
   * Executes the post creation logic.
   * @param input - The data required to create the post.
   * @returns A Promise resolving to the newly created Post entity.
   * @throws {ValidationError} if input data is invalid (e.g., empty title/content).
   * @throws {NotFoundError} if the specified author does not exist.
   * @throws {AppError} for other specific application or persistence errors.
   */
  async execute(input: CreatePostInput): Promise<Post> {
    // 1. --- Input Validation ---
    // Basic validation (non-empty fields). More complex validation might use a dedicated library/service.
    if (!input.title?.trim()) {
      throw new ValidationError("Post title cannot be empty.")
    }
    if (!input.content?.trim()) {
      throw new ValidationError("Post content cannot be empty.")
    }
    if (input.authorId == null) {
      throw new ValidationError("Author ID must be provided.")
    }
    if (input.authorId < 0) {
      throw new ValidationError("Author ID must be a positive integer.")
    }

    // TODO: Implement this
    // 2. --- Business Rule Validation / Dependency Checks ---
    // Ensure the author exists before creating a post associated with them.
    // const authorExists = await this.userRepository.findById(input.authorId);
    // if (!authorExists) {
    //   // Use specific error types for better error handling downstream
    //   // this.logger?.warn(`Author not found for ID: ${input.authorId}`); // Optional logging
    //   throw new NotFoundError(`Author with ID ${input.authorId} not found.`);
    // }

    const post = Post.create({
      title: input.title.trim(),
      content: input.content.trim(),
      authorId: input.authorId,
      status: PostStatus.DRAFT,
    })

    // 4. --- Persistence ---
    // Use the repository to save the entity.
    // The repository implementation handles the actual DB interaction.
    // Consider wrapping in try/catch if the repository might throw specific
    // infrastructure errors you want to handle or wrap here. Often, repositories
    // might already throw AppError subtypes.
    try {
      await this.postRepository.save(post)
      // this.logger?.info(`Successfully created post with ID: ${post.id}`); // Optional logging
    } catch (error) {
      // this.logger?.error(`Failed to save post: ${error.message}`, error); // Optional logging
      // Re-throw a generic error or a specific persistence error if needed
      // This depends on how your repository handles errors.
      throw new AppError(
        "Failed to save the post due to a persistence issue.",
        500,
        error
      )
    }

    return post
  }
}
