export const ROUNDS = [
  { value: 'east-1', label: '東1局' },
  { value: 'east-2', label: '東2局' },
  { value: 'east-3', label: '東3局' },
  { value: 'east-4', label: '東4局' },
  { value: 'south-1', label: '南1局' },
  { value: 'south-2', label: '南2局' },
  { value: 'south-3', label: '南3局' },
  { value: 'south-4', label: '南4局' },
];

export const TURNS = Array.from({ length: 17 }, (_, i) => ({
  value: `${i + 1}`,
  label: `${i + 1}巡目`,
}));

export const MAX_DESCRIPTION_LENGTH = 500;