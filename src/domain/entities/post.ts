import { randomInt } from "node:crypto"

// --- Custom Error ---
export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DomainError"
  }
}

export class PostContentDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PostContentDomainError"
  }
}

export class PostTitleIsRequiredError extends Error {
  constructor(message: string) {
    super(message)
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
  createdAt: Date
  updatedAt: Date
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
  private _createdAt: Date
  private _updatedAt: Date

  private static clock: Clock = systemClock

  private constructor(props: PostProps) {
    if (!props.title || !props.title.trim().length) {
      throw new Error("Title is required")
    }
    if (!props.content || !props.content.trim().length) {
      throw new Error("Content is required")
    }
    if (!props.authorId) {
      throw new Error("Author ID is required")
    }

    this._id = props.id
    this._title = props.title
    this._content = props.content
    this._authorId = props.authorId
    this._status = props.status
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
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
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }

  // --- Validation logic ---
  private static validateTitle(title: string) {
    if (!title || !title.trim().length) {
      throw new DomainError("Title is required")
    }
    if (title.length > 255) {
      throw new DomainError("Title must be less than 255 characters")
    }
  }

  private static validateContent(content: string) {
    if (!content || !content.trim().length) {
      throw new DomainError("Content is required")
    }
  }

  private static validateAuthorId(authorId: number) {
    if (!authorId) {
      throw new DomainError("Author ID is required")
    }

    if (authorId < 0) {
      throw new DomainError("Author ID must be greater than 0")
    }

    if (typeof authorId !== "number") {
      throw new DomainError("Author ID must be a number")
    }
  }

  // --- Factory method to create a new Post ---

  public static create(
    props: Omit<PostProps, "id" | "createdAt" | "updatedAt">
  ): Post {
    Post.validateTitle(props.title)
    Post.validateContent(props.content)
    Post.validateAuthorId(props.authorId)

    const now = Post.clock.now()

    const post = new Post({
      ...props,
      id: randomInt(1, 1000),
      status: PostStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    })

    return post
  }

  updateDetails(props: Pick<PostProps, "title" | "content">) {
    Post.validateTitle(props.title)
    Post.validateContent(props.content)

    this._title = props.title
    this._content = props.content
    this._updatedAt = Post.clock.now()
  }

  // --- Dommain Methods ---
  publish(): void {
    if (this._status !== PostStatus.PUBLISHED) {
      console.warn(`Post ${this.id} is already published.`)
      return
    }
    this._status = PostStatus.PUBLISHED
  }

  unpublish(): void {
    if (this._status !== PostStatus.PUBLISHED) {
      console.warn(`Post ${this.id} is not published.`)
      return
    }
    this._status = PostStatus.DRAFT
    this._updatedAt = Post.clock.now()
  }

  public static setClock(clock: Clock): void {
    this.clock = clock
  }
}
