import { FC } from 'react';
import './style.css';

export const Error: FC = ({ children }) => <div className='error'>
  {children}
</div>
