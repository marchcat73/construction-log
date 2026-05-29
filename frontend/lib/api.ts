export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export const fetcher = async (url: string) => {
  try {
    const res = await fetch(`${API_URL}${url}`);
    if (!res.ok) throw new Error('Ошибка загрузки данных');
    return res.json();
  } catch (error: unknown) {
    throw error;
  }
};

export const api = {
  logs: `${API_URL}/logs`,
  workTypes: `${API_URL}/work-types`,
};
