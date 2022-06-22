import { FC, PropsWithChildren } from 'react';

export const P: FC<PropsWithChildren> = ({ children }) => <div>{children}</div>;
export const Title: FC<PropsWithChildren> = ({ children }) => <h5>{children}</h5>;
export const Header: FC<PropsWithChildren> = ({ children }) => <h6>{children}</h6>;
export const SubHeader: FC<PropsWithChildren> = ({ children }) => <h2>{children}</h2>;
