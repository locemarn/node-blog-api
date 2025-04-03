import { Post, PostStatus } from "../../domain/entities/post.entity"

export interface FindAllOptions {
  page: number
  limit: number
  status?: PostStatus
  sortBy?: "createdAt" | "updatedAt"
  sortOrder?: "ASC" | "DESC"
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface PostRepository {
  /**
   * Finds all Posts, optionally applying pagination and filtering.
   * @param options Optional parameters for pagination and filtering.
   * @returns A paginated result object containing the posts for the page and total count.
   */
  findAll(options?: FindAllOptions): Promise<PaginatedResult<Post>>

  /**
   * Saves a Post entity (handles both creation and updates).
   * Assumes the Post entity passed in contains the desired state.
   * Consider returning Promise<Post> if persistence modifies the entity (e.g., versioning).
   * @param post The Post domain entity to persist.
   * @throws Error if persistence fails.
   */
  save(post: Post): Promise<Post>

  /**
   * Updates a Post entity.
   * Assumes the Post entity passed in contains the desired state.
   * Consider returning Promise<Post> if persistence modifies the entity (e.g., versioning).
   * @param post The Post domain entity to update.
   * @throws Error if persistence fails.
   */
  update(post: Post): Promise<Post>

  /**
   * Finds a Post by its unique ID.
   * @param id The ID of the post to find.
   * @returns The Post entity or null if not found.
   */
  findById(id: number): Promise<Post | null>

  /**
   * Deletes a Post by its unique ID.
   * @param id The ID of the post to delete.
   * @throws Error if deletion fails.
   */
  deleteById(id: number): Promise<void>
}
