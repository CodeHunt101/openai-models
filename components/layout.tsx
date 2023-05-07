import type { ReactElement, ReactNode } from 'react';

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <main className='p-10'>{children}</main>
    </>
  );
}
