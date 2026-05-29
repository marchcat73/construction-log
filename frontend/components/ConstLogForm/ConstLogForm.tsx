'use client';
import React from 'react';
import cn from 'classnames';
import { ConstLogFormProps } from './ConstLogForm.props';
import styles from './ConstLogForm.module.css';

const ConstLogForm = ({ className, ...props }: ConstLogFormProps) => {
  return (
    <div className={cn(styles.overlay, className)} {...props}>
      ConstLogForm
    </div>
  );
};

export default ConstLogForm;
