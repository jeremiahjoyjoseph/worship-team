export const USER_ROLES = [
  "admin",
  "worship-pastor",
  "worship-leader",
  "worship-team-member",
  "media-team",
  "sound-team",
  "guest",
];

export const USER_ROLES_OPTIONS = USER_ROLES.map((role) => ({
  label: role.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
  value: role,
}));
