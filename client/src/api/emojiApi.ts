import axios from 'axios';

// 1. Описываем типы данных
export interface IEmojiItem {
  id: number;
  emoji: string;
  title: string;
  keywords: string;
}

const API_URL = 'http://localhost:3000/api/emojis';

export const getEmojis = async (query: string = ''): Promise<IEmojiItem[]> => {
  try {
    // Отправляем запрос с параметром q, если строка не пустая
    const response = await axios.get(API_URL, {
      params: query ? { q: query } : {},
    });

    // Сервер возвращает массив, но без id. Добавим id на лету, 
    // чтобы React не ругался на key={emoji.id}
    const data: IEmojiItem[] = response.data.map((item: any, index: number) => ({
      ...item,
      id: index, 
    }));

    return data;
  } catch (error) {
    // Пробрасываем ошибку дальше, чтобы компонент ее поймал
    console.error('Ошибка при запросе к API:', error);
    throw error; 
  }
};