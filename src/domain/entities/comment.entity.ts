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
  created_at: Date
  updated_at: Date
}

export class Comment {
  private _id: number
  private _content: string
  private _postId: number
  private _authorId: number
  private _created_at: Date
  private _updated_at: Date

  private static clock: Clock = systemClock

  constructor(props: CommentProps) {
    this._id = props.id
    this._content = props.content
    this._postId = props.postId
    this._authorId = props.authorId
    this._created_at = props.created_at
    this._updated_at = props.updated_at
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

  get created_at(): Date {
    return this._created_at
  }

  get updated_at(): Date {
    return this._updated_at
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
    props: Omit<CommentProps, "id" | "created_at" | "updated_at">
  ): Comment {
    Comment.validateContent(props.content)
    Comment.validatePostId(props.postId)
    Comment.validateAuthorId(props.authorId)

    const now = Comment.clock.now()

    const comment = new Comment({
      ...props,
      id: Number(randomInt(1, 1000)),
      created_at: now,
      updated_at: now,
    })

    return comment
  }

  updateDetails(props: Pick<CommentProps, "content">): Comment {
    Comment.validateContent(props.content)

    this._content = props.content
    this._updated_at = Comment.clock.now()

    return this
  }

  public static setClock(clock: Clock): void {
    this.clock = clock
  }
}
