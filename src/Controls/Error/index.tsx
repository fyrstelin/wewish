import React from 'react';
import './style.css';

type Props = { children: React.ReactNode };
export const Error = ({children}: Props) => <div className='error'>
    {children}
</div>