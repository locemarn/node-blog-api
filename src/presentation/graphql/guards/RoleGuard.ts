export interface ITContext {
  user: {
    role: string
    [key: string]: any
  }
  [key: string]: any
}

export class RoleGuard {
  private readonly _roles: string[]

  constructor(roles: string | string[]) {
    this._roles = Array.isArray(roles) ? roles : [roles]
  }

  handle<TArgs = any, TResult = any>(
    resolverFn: (
      parent: any,
      args: TArgs,
      context: ITContext,
      info: any
    ) => TResult | Promise<TResult>
  ): (
    parent: any,
    args: TArgs,
    context: ITContext,
    info: any
  ) => TResult | Promise<TResult> {
    return (parent, args, context, info) => {
      const user = context.user

      if (!user || !this._roles.includes(user.role)) {
        throw new Error("Access denied.")
      }

      return resolverFn(parent, args, context, info)
    }
  }
}
