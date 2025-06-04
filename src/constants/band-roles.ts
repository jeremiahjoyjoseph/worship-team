export const BAND_ROLES = [
  "vocals",
  "drums",
  "keys",
  "acoustic",
  "bass",
  "electric",
  "bgv",
  "md",
];

export const BAND_ROLES_OPTIONS = BAND_ROLES.map((role) => ({
  label: role.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
  value: role,
}));
