import { useState, useEffect } from 'react';
import { getEmojis, type IEmojiItem } from '../../api/emojiApi';
import styles from './EmojiFinder.module.css';

export default function EmojiFinder() {
  const [emojis, setEmojis] = useState<IEmojiItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Эффект, который срабатывает при изменении searchTerm
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEmojis(searchTerm);
        setEmojis(data);
      } catch (err) {
        setError('Не удалось загрузить данные. Проверьте, запущен ли сервер (start.bat).');
      } finally {
        setLoading(false);
      }
    };

    // Дебаунс (задержка), чтобы не спамить сервер при каждом нажатии клавиши
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Если произошла ошибка, показываем только её
  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Поиск эмодзи</h1>
      
      {/* Поле поиска */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Введите название или ключевое слово..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className={styles.clearBtn}>
            Очистить
          </button>
        )}
      </div>

      {/* Состояние загрузки */}
      {loading && <div className={styles.loading}>Загрузка эмодзи...</div>}

      {/* Сетка карточек (Grid) */}
      {!loading && (
        <div className={styles.grid}>
          {emojis.length === 0 ? (
            <p className={styles.empty}>Эмодзи не найдены</p>
          ) : (
            emojis.map((emoji) => (
              <div key={emoji.id} className={styles.card}>
                <div className={styles.emojiSymbol}>{emoji.emoji}</div>
                <h3 className={styles.emojiTitle}>{emoji.title}</h3>
                <small className={styles.emojiKeywords}>{emoji.keywords}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}