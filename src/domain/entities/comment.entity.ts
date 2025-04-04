import { randomInt } from "node:crypto"

// --- Custom Error ---
export class CommentDomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CommentDomainError"
  }
}

export interface Clock {
  now(): Date
}

const systemClock: Clock = {
  now: () => new Date(),
}
export interface CommentProps {
  id: number
  content: string
  postId: number
  authorId: number
  createdAt: Date
  updatedAt: Date
}

export class Comment {
  private _id: number
  private _content: string
  private _postId: number
  private _authorId: number
  private _createdAt: Date
  private _updatedAt: Date

  private static clock: Clock = systemClock

  constructor(props: CommentProps) {
    this._id = props.id
    this._content = props.content
    this._postId = props.postId
    this._authorId = props.authorId
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  get id(): number {
    return this._id
  }

  get content(): string {
    return this._content
  }

  get postId(): number {
    return this._postId
  }

  get authorId(): number {
    return this._authorId
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  private static validateContent(content: string): void {
    if (!content.trim()) {
      throw new CommentDomainError("Content is required")
    }

    if (content.length < 3) {
      throw new CommentDomainError("Content must be at least 3 characters long")
    }

    if (content.length > 1000) {
      throw new CommentDomainError(
        "Content must be less than 1000 characters long"
      )
    }
  }

  private static validatePostId(postId: number): void {
    if (!postId) {
      throw new CommentDomainError("Post ID is required")
    }

    if (typeof postId !== "number") {
      throw new CommentDomainError("Post ID must be a number")
    }
  }

  private static validateAuthorId(authorId: number): void {
    if (!authorId) {
      throw new CommentDomainError("Author ID is required")
    }

    if (typeof authorId !== "number") {
      throw new CommentDomainError("Author ID must be a number")
    }
  }

  public static create(
    props: Omit<CommentProps, "id" | "createdAt" | "updatedAt">
  ): Comment {
    Comment.validateContent(props.content)
    Comment.validatePostId(props.postId)
    Comment.validateAuthorId(props.authorId)

    const now = Comment.clock.now()

    const comment = new Comment({
      ...props,
      id: Number(randomInt(1, 1000)),
      createdAt: now,
      updatedAt: now,
    })

    return comment
  }

  updateDetails(props: Pick<CommentProps, "content">): Comment {
    Comment.validateContent(props.content)

    this._content = props.content
    this._updatedAt = Comment.clock.now()

    return this
  }

  public static setClock(clock: Clock): void {
    this.clock = clock
  }
}
