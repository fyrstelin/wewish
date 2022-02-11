import React from 'react';
import { User } from './index';

export const { Provider, Consumer } = React.createContext<User | null>(null);