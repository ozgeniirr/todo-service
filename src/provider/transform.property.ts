export function transformProperty(value: any, propertyName?: string) {
  if (value == null) return value;

  if (typeof value !== 'string') return value;

  const trimmed = value.trim();

  if (propertyName === 'email') {
    return trimmed.toLowerCase();
  }

  return trimmed.toLocaleLowerCase('tr-TR');
}
