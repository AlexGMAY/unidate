export const paginate = <T>(array: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  return array.slice(startIndex, startIndex + limit);
};

export const cacheKeyGenerator = (
  prefix: string, 
  params: Record<string, any>
) => {
  return `${prefix}:${Object.entries(params)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join('&')}`;
};

export const validateUniversityEmail = (email: string) => {
  const domain = email.split('@')[1];
  return domain.endsWith('.edu') || domain.endsWith('.ac.fr');
};