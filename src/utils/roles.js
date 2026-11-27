export function isAdminRole(role) {
  if (typeof role !== 'string') return false;
  return role.trim().toUpperCase().replace(/^ROLE_/, '') === 'ADMIN';
}