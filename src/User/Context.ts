import { createContext } from 'react';
import { User } from './index';

export const { Provider, Consumer } = createContext<User | null>(null);
