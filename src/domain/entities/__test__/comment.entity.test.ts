import { Comment, Clock, CommentDomainError } from "../comment.entity"

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

describe("Comment Entity", () => {
  let mockClock: MockClock
  const validCreateProps = {
    content: "Test Comment",
    postId: 1,
    authorId: 1,
  }

  beforeEach(() => {
    mockClock = new MockClock()
    Comment.setClock(mockClock)
  })

  describe("create", () => {
    it("should create a comment", () => {
      const comment = Comment.create({
        content: "Test Comment",
        postId: 1,
        authorId: 1,
      })

      expect(comment).toBeInstanceOf(Comment)
      expect(comment.id).toBeDefined()
      expect(comment.content).toBe(validCreateProps.content)
      expect(comment.postId).toBe(validCreateProps.postId)
      expect(comment.authorId).toBe(validCreateProps.authorId)
      expect(comment.createdAt).toBeDefined()
      expect(comment.updatedAt).toBeDefined()
    })

    it("should throw a CommentDomainError if content is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        content: "     ",
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })

    it("should throw a CommentDomainError if content is too long", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        content: "a".repeat(1001),
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })

    it("should throw a CommentDomainError if content is too small", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        content: "a",
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })

    it("should throw a CommentDomainError if postId is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        postId: undefined as unknown as number,
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })

    it("should throw a CommentDomainError if postId is not a number", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        postId: "not a number" as unknown as number,
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })

    it("should throw a CommentDomainError if authorId is missing", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        authorId: undefined as unknown as number,
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })

    it("should throw a CommentDomainError if authorId is not a number", () => {
      const invalidCreateProps = {
        ...validCreateProps,
        authorId: "not a number" as unknown as number,
      }

      expect(() => Comment.create(invalidCreateProps)).toThrow(
        CommentDomainError
      )
    })
  })

  describe("updateDetails", () => {
    it("should update the comment", () => {
      const comment = Comment.create({
        ...validCreateProps,
      })

      const updatedComment = comment.updateDetails({
        content: "Updated Comment",
      })

      expect(updatedComment).toBe(comment)
    })

    it("should throw a CommentDomainError if content is missing", () => {
      const comment = Comment.create({
        ...validCreateProps,
      })

      expect(() =>
        comment.updateDetails({
          content: "     ",
        })
      ).toThrow(CommentDomainError)
    })

    it("should throw a CommentDomainError if content is too long", () => {
      const comment = Comment.create({
        ...validCreateProps,
      })

      expect(() =>
        comment.updateDetails({
          content: "a".repeat(1001),
        })
      ).toThrow(CommentDomainError)
    })

    it("should throw a CommentDomainError if content is too small", () => {
      const comment = Comment.create({
        ...validCreateProps,
      })

      expect(() =>
        comment.updateDetails({
          content: "a",
        })
      ).toThrow(CommentDomainError)
    })
  })
})
