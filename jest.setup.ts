/* eslint-disable @typescript-eslint/no-unsafe-return */
jest.mock("@prisma/client", () => ({
  ...jest.requireActual("@prisma/client"),
  Role: {
    USER: "USER",
    ADMIN: "ADMIN",
  },
}))
