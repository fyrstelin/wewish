import { FC, PropsWithChildren } from 'react';
import './style.css';

export const Error: FC<PropsWithChildren> = ({ children }) => <div className='error'>
  {children}
</div>
