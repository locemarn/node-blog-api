import { User } from "../entities/user.entity.js"

export interface UserRepository {
  /**
   * Finds a User by their unique ID.
   * @param id The ID of the user to find.
   * @returns The User entity or null if not found.
   */
  findById(id: number): Promise<User | null>

  /**
   * Saves a User entity (handles both creation and updates).
   * Assumes the User entity passed in contains the desired state.
   * Consider returning Promise<User> if persistence modifies the entity (e.g., versioning).
   * @param user The User domain entity to persist.
   * @throws Error if persistence fails.
   */
  save(user: User): Promise<User>

  /**
   * Updates a User entity.
   * Assumes the User entity passed in contains the desired state.
   * Consider returning Promise<User> if persistence modifies the entity (e.g., versioning).
   * @param user The User domain entity to update.
   * @throws Error if persistence fails.
   */
  update(user: User): Promise<User>

  /**
   * Deletes a User by their unique ID.
   * @param id The ID of the user to delete.
   * @throws Error if deletion fails.
   */
  deleteById(id: number): Promise<void>

  /**
   * Finds a User by their email address.
   * @param email The email address of the user to find.
   * @returns The User entity or null if not found.
   */
  findByEmail(email: string): Promise<User | null>
}
