export type Permission = string;
export type Role = string;

interface AuthData {
  permissions: Permission[];
  roles?: Role[];
}

/**
 * Mengecek apakah user punya permission tertentu
 */
export function can(permission: Permission, auth: AuthData): boolean {
    return (auth.permissions ?? []).includes(permission);
  }


/**
 * (Opsional) Mengecek apakah user punya role tertentu
 */
export function hasRole(role: Role, auth: AuthData): boolean {
  return auth.roles?.includes(role) ?? false;
}
