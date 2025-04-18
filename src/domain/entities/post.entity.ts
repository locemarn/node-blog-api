import { randomInt } from "node:crypto"

// --- Custom Error ---

export class PostDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PostDomainError"
  }
}

// --- Post Status Enum (Optional but often clearer than string literals) ---
export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  // ARCHIVED = 'archived' // Example of future extension
}

export interface PostProps {
  id: number
  title: string
  content: string
  authorId: number
  status: PostStatus
  created_at: Date
  updated_at: Date
}

export interface Clock {
  now(): Date
}

const systemClock: Clock = {
  now: () => new Date(),
}

export class Post {
  private _id: number
  private _title: string
  private _content: string
  private _authorId: number
  private _status: PostStatus
  private _created_at: Date
  private _updated_at: Date

  private static clock: Clock = systemClock

  private constructor(props: PostProps) {
    this._id = props.id
    this._title = props.title
    this._content = props.content
    this._authorId = props.authorId
    this._status = props.status
    this._created_at = props.created_at
    this._updated_at = props.updated_at
  }

  // --- Getters for Encapsulation ---
  get id(): number {
    return this._id
  }
  get authorId(): number {
    return this._authorId
  }
  get title(): string {
    return this._title
  }
  get content(): string {
    return this._content
  }
  get status(): PostStatus {
    return this._status
  }
  get created_at(): Date {
    return this._created_at
  }
  get updated_at(): Date {
    return this._updated_at
  }

  // --- Validation logic ---
  private static validateTitle(title: string) {
    if (!title?.trim().length) {
      throw new PostDomainError("Title is required")
    }
    if (title.length > 255) {
      throw new PostDomainError("Title must be less than 255 characters")
    }
  }

  private static validateContent(content: string) {
    if (!content?.trim().length) {
      throw new PostDomainError("Content is required")
    }
  }

  private static validateAuthorId(authorId: number) {
    if (!authorId) {
      throw new PostDomainError("Author ID is required")
    }

    if (authorId < 0) {
      throw new PostDomainError("Author ID must be greater than 0")
    }

    if (typeof authorId !== "number") {
      throw new PostDomainError("Author ID must be a number")
    }
  }

  // --- Factory method to create a new Post ---

  public static create(
    props: Omit<PostProps, "id" | "created_at" | "updated_at">
  ): Post {
    Post.validateTitle(props.title)
    Post.validateContent(props.content)
    Post.validateAuthorId(props.authorId)

    const now = Post.clock.now()

    const post = new Post({
      ...props,
      id: Number(randomInt(1, 1000)),
      status: PostStatus.DRAFT,
      created_at: now,
      updated_at: now,
    })

    return post
  }

  updateDetails(props: Pick<PostProps, "title" | "content">) {
    Post.validateTitle(props.title)
    Post.validateContent(props.content)

    this._title = props.title
    this._content = props.content
    this._updated_at = Post.clock.now()
  }

  // --- Dommain Methods ---
  publish(): void {
    if (this._status === PostStatus.PUBLISHED) {
      // console.warn(`Post ${this.id} is already published.`)
      throw new PostDomainError(`Post ${this.id} is already published.`)
    }
    this._status = PostStatus.PUBLISHED
    this._updated_at = Post.clock.now()
  }

  unpublish(): void {
    if (this._status === PostStatus.DRAFT) {
      // console.warn(`Post ${this.id} is already drafted.`)
      throw new PostDomainError(`Post ${this.id} is already drafted.`)
    }
    this._status = PostStatus.DRAFT
    this._updated_at = Post.clock.now()
  }

  public static setClock(clock: Clock): void {
    this.clock = clock
  }
}
