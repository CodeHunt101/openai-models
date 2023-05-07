import type { ReactNode } from 'react';
import SwitchTheme from './switchTheme';

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <main className='p-10'>
        <SwitchTheme />
        {children}
      </main>
    </>
  );
}
