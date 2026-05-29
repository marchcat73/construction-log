'use client';
import { useState } from 'react';
import cn from 'classnames';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { fetcher, API_URL } from '@/lib/api';
import { useUiStore } from '@/stores';
import { ConstLogForm } from '@/components';
import { HomePageProps } from './HomePage.props';
import styles from './HomePage.module.css';

const HomePage = ({ className, ...props }: HomePageProps) => {
  const { openModal } = useUiStore();
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const {
    data: logs,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(`/logs?sort=${sort}`, fetcher);

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить запись?')) return;
    try {
      await fetch(`${API_URL}/logs/${id}`, { method: 'DELETE' });
      await mutate(null, {
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      });
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <main className={cn(styles.container, className)} {...props}>
      <header className={styles.header}>
        <h1 className={styles.title}>Журнал строительных работ</h1>
        <div className={styles.controls}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
            className={styles.select}
          >
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </select>
          <button onClick={() => openModal()} className={styles.btnPrimary}>
            + Добавить
          </button>
        </div>
      </header>
      {isLoading || isValidating ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : (
        <ul className={styles.list}>
          {logs?.map((log: any) => (
            <li key={log.id} className={styles.card}>
              <div className={styles.date}>
                {new Date(log.workDate).toLocaleDateString('ru-RU')}
              </div>
              <div className={styles.info}>
                <strong>{log.workTypeName || 'Без вида'}</strong>
                <span>{log.volume}</span>
              </div>
              <div className={styles.worker}>👷 {log.workerName}</div>
              <div className={styles.actions}>
                <button onClick={() => openModal(log)}>✏️</button>
                <button
                  onClick={() => handleDelete(log.id)}
                  className={styles.btnDanger}
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
          {logs?.length === 0 && (
            <p className={styles.empty}>Записей пока нет</p>
          )}
        </ul>
      )}
      <ConstLogForm />
    </main>
  );
};

export default HomePage;
