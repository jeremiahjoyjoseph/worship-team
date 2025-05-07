export const BAND_ROLES = [
  "vocals",
  "drums",
  "keys",
  "acoustic",
  "bass",
  "electric",
];

export const BAND_ROLES_OPTIONS = BAND_ROLES.map((role) => ({
  value: role,
  label: role.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
}));
