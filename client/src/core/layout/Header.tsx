import React, { memo, ReactNode } from 'react';

interface IHeader {
  label: string;
  children: ReactNode;
}

const Header = ({ label, children }: IHeader) => (
  <div>
    { label }
    { children }
  </div>
);

export default memo(Header);
