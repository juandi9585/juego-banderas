import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
