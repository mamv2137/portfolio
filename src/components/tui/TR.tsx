import type { ReactNode, ElementType } from 'react';

export type TRProps = {
  en: ReactNode;
  es: ReactNode;
  as?: ElementType;
  className?: string;
};

export default function TR({ en, es, as: Tag = 'span', className }: TRProps) {
  return (
    <Tag className={className}>
      <span data-lang="en">{en}</span>
      <span data-lang="es">{es}</span>
    </Tag>
  );
}
