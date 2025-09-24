import { UserType } from "@prisma/client"

export interface AuthUser {
  id: string
  email: string
  name: string
  userType: UserType
  sppgId?: string
  roles?: UserRole[]
  permissions?: Permission[]
}

export interface UserRole {
  id: string
  roleId: string
  role: {
    id: string
    name: string
    description?: string
    sppgId?: string
  }
}

export interface Permission {
  id: string
  name: string
  action: string
  module: string
  description?: string
}

export interface SessionUser extends AuthUser {
  image?: string
}

declare module "next-auth" {
  interface User extends AuthUser {}
  
  interface Session {
    user: SessionUser
  }
}

declare module "next-auth/jwt" {
  interface JWT extends AuthUser {}
}