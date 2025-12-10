import type { Staff } from "@prisma/client";

// FORMS
// Derive từ Prisma Staff model và extend với các field UI-specific

export type LoginFormType = Pick<Staff, "email"> & {
  password: string;
};

export type RegisterFormType = Pick<Staff, "name" | "email"> & {
  password: string;
  confirmPassword: string;
};
