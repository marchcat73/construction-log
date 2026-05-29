/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import cn from 'classnames';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_URL } from '@/lib/api';
import { logSchema, type LogFormValues } from '@/schemas/constlog.schema';
import { useUiStore } from '@/stores';
import { ConstLogFormProps } from './ConstLogForm.props';
import styles from './ConstLogForm.module.css';

// Предзаполненный список для удобства (можно заменить на SWR-запрос GET /workers)
const PREDEFINED_WORKERS = ['Иванов И.И.', 'Петров С.С.', 'Сидоров А.А.'];
const PREDEFINED_WORK_TYPES = [
  'Кладка перегородок',
  'Монтаж опалубки',
  'Армирование',
  'Бетонирование',
  'Штукатурка',
];

const ConstLogForm = ({ className, ...props }: ConstLogFormProps) => {
  const { isModalOpen, editingLog, closeModal } = useUiStore();
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: (editingLog && editingLog) || {
      workDate: new Date().toISOString().split('T')[0],
      workerName: '',
      workType: '',
      volume: '',
    },
  });

  const onSubmit = async (data: LogFormValues) => {
    setIsSubmitting(true);
    try {
      const url = editingLog
        ? `${API_URL}/logs/${editingLog.id}`
        : `${API_URL}/logs`;
      const method = editingLog ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Ошибка сервера');

      toast.success(editingLog ? 'Запись обновлена' : 'Запись добавлена');
      await mutate('/logs', null, {
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      });
      closeModal();
      reset();
    } catch {
      toast.error('Не удалось сохранить запись');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      onClick={closeModal}
      className={cn(styles.overlay, className)}
      {...props}
    >
      <form
        className={styles.form}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>{editingLog ? 'Редактирование' : 'Новая запись'}</h2>
        <label>
          Дата
          <input
            type="date"
            {...register('workDate')}
            className={styles.input}
          />
          {errors.workDate && (
            <span className={styles.error}>{errors.workDate.message}</span>
          )}
        </label>

        <label>
          Вид работ
          <input
            list="work-types-list"
            {...register('workType')}
            className={styles.input}
            placeholder="Выберите или введите..."
          />
          <datalist id="work-types-list">
            {PREDEFINED_WORK_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          {errors.workType && (
            <span className={styles.error}>{errors.workType.message}</span>
          )}
        </label>

        <label>
          ФИО исполнителя
          <input
            list="workers-list"
            {...register('workerName')}
            className={styles.input}
            placeholder="Выберите или введите ФИО..."
          />
          <datalist id="workers-list">
            {PREDEFINED_WORKERS.map((w) => (
              <option key={w} value={w} />
            ))}
          </datalist>
          {errors.workerName && (
            <span className={styles.error}>{errors.workerName.message}</span>
          )}
        </label>
        <label>
          Объём
          <input
            {...register('volume')}
            className={styles.input}
            placeholder="напр. 23м³"
          />
          {errors.volume && (
            <span className={styles.error}>{errors.volume.message}</span>
          )}
        </label>

        <div className={styles.actions}>
          <button type="button" onClick={closeModal} disabled={isSubmitting}>
            Отмена
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConstLogForm;
