import {
  Clock,
  PostTitleIsRequiredError,
  Post,
  PostStatus,
  PostContentDomainError,
  PostAuthorIdIsRequiredError,
  PostAlreadyPublishedError,
  PostAlreadyDraftedError,
} from "../post.entity"

class MockClock implements Clock {
  private _currentTime: Date

  constructor(initialTime: Date = new Date("2025-01-01T10:00:00.000Z")) {
    this._currentTime = initialTime
  }

  now(): Date {
    return this._currentTime
  }

  tick(ms: number): void {
    this._currentTime = new Date(this._currentTime.getTime() + ms)
  }

  setTime(date: Date): void {
    this._currentTime = date
  }
}

describe("Post Entity", () => {
  let mockClock: MockClock
  const validCreateProps = {
    title: "Test Post",
    content: "Test Content",
    authorId: 1,
    status: PostStatus.DRAFT,
  }

  beforeEach(() => {
    mockClock = new MockClock()
    Post.setClock(mockClock)
  })

  // --- testing Creation ---
  describe("Post.Creation factory method", () => {
    it("should create a post with valid props", () => {
      const post = Post.create(validCreateProps)

      expect(post).toBeInstanceOf(Post)
      expect(post.id).toBeDefined()
      expect(post.title).toBe(validCreateProps.title)
      expect(post.content).toBe(validCreateProps.content)
      expect(post.authorId).toBe(validCreateProps.authorId)
      expect(post.status).toBe(validCreateProps.status)
      expect(post.status).toBe(PostStatus.DRAFT)
      expect(post.createdAt).toBeDefined()
      expect(post.createdAt).toBeInstanceOf(Date)
      expect(post.updatedAt).toBeDefined()
      expect(post.updatedAt).toBeInstanceOf(Date)
      expect(post.updatedAt).toBe(post.createdAt)
    })

    it("should throw an PostTitleIsRequiredError if title is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        title: "     ",
      }

      expect(() => Post.create(invalidCreateProps)).toThrow(
        PostTitleIsRequiredError
      )
    })

    it("should throw an PostTitleIsRequiredError if title is too long", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        title: "a".repeat(256),
      }

      expect(() => Post.create(invalidCreateProps)).toThrow(
        PostTitleIsRequiredError
      )
    })

    it("should throw an PostContentDomainError if content is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        content: "",
      }

      expect(() => Post.create(invalidCreateProps)).toThrow(
        PostContentDomainError
      )
    })

    it("should throw an PostAuthorIdIsRequiredError if authorId is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        authorId: undefined as unknown as number,
      }

      expect(() => Post.create(invalidCreateProps)).toThrow(
        PostAuthorIdIsRequiredError
      )
    })

    it("should throw an PostAuthorIdIsRequiredError if authorId < 0", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        authorId: -10,
      }

      expect(() => Post.create(invalidCreateProps)).toThrow(
        PostAuthorIdIsRequiredError
      )
    })

    it("should throw an PostAuthorIdIsRequiredError if authorId is not a number", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        authorId: "10" as unknown as number,
      }

      expect(() => Post.create(invalidCreateProps)).toThrow(
        PostAuthorIdIsRequiredError
      )
    })
  })

  describe("Post.updateDetails method", () => {
    it("should update the title and content of the post", () => {
      const post = Post.create(validCreateProps)
      const initialUpdatedAt = post.updatedAt
      const updatedTitle = "Updated Title"
      const updatedContent = "Updated Content"

      mockClock.tick(10000)
      post.updateDetails({
        title: updatedTitle,
        content: updatedContent,
      })

      expect(post.title).toBe(updatedTitle)
      expect(post.content).toBe(updatedContent)
      expect(post.updatedAt).not.toBe(initialUpdatedAt)
      expect(post.updatedAt).toBeInstanceOf(Date)
    })

    it("should throw an PostTitleIsRequiredError if title is missing", () => {
      const post = Post.create(validCreateProps)
      const invalidUpdateProps = {
        ...validCreateProps,
        title: "",
      }

      expect(() => post.updateDetails(invalidUpdateProps)).toThrow(
        PostTitleIsRequiredError
      )
    })

    it("should throw an PostTitleIsRequiredError if title is too long", () => {
      const post = Post.create(validCreateProps)
      const invalidUpdateProps = {
        ...validCreateProps,
        title: "a".repeat(256),
      }

      expect(() => post.updateDetails(invalidUpdateProps)).toThrow(
        PostTitleIsRequiredError
      )
    })

    it("should throw an PostContentDomainError if content is missing", () => {
      const post = Post.create(validCreateProps)
      const invalidUpdateProps = {
        ...validCreateProps,
        content: "",
      }

      expect(() => post.updateDetails(invalidUpdateProps)).toThrow(
        PostContentDomainError
      )
    })
  })

  describe("Post.publish method", () => {
    it("should publish the post", () => {
      const post = Post.create(validCreateProps)
      const initialUpdatedAt = post.updatedAt

      mockClock.tick(5000)
      post.publish()

      expect(post.status).toBe(PostStatus.PUBLISHED)
      expect(post.updatedAt.getTime()).toBeGreaterThan(
        initialUpdatedAt.getTime()
      )
      expect(post.updatedAt).toEqual(mockClock.now())
      expect(post.updatedAt).toBeInstanceOf(Date)
    })

    it("should throw an error if the post is already published", () => {
      const post = Post.create(validCreateProps)
      post.publish()

      expect(() => post.publish()).toThrow(PostAlreadyPublishedError)
    })
  })

  describe("Post.unpublish method", () => {
    it("should unpublish the post", () => {
      const post = Post.create(validCreateProps)
      post.publish()
      mockClock.tick(2000)
      const publishedAt = post.updatedAt

      mockClock.tick(5000)
      post.unpublish()

      expect(post.status).toBe(PostStatus.DRAFT)
      expect(post.updatedAt.getTime()).toBeGreaterThan(publishedAt.getTime())
      expect(post.updatedAt).toEqual(mockClock.now())
      expect(post.updatedAt).toBeInstanceOf(Date)
    })

    it("should throw PostAlreadyDraftedError if the post is already drafted", () => {
      const post = Post.create(validCreateProps)
      expect(() => post.unpublish()).toThrow(PostAlreadyDraftedError)
    })
  })

  describe("Getters", () => {
    it("should return the correct values for the getters", () => {
      const post = Post.create(validCreateProps)
      expect(post.id).toBeDefined()
      expect(post.title).toBe(validCreateProps.title)
      expect(post.content).toBe(validCreateProps.content)
      expect(post.authorId).toBe(validCreateProps.authorId)
      expect(post.status).toBe(validCreateProps.status)
      expect(post.createdAt).toBeDefined()
      expect(post.createdAt).toBeInstanceOf(Date)
      expect(post.updatedAt).toBeDefined()
    })
  })
})
