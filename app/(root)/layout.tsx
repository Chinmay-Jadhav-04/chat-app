import React from 'react';
import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper';

interface RootLayoutProps {
  children: React.ReactNode;
}

const Layout = ({children}: RootLayoutProps) => {
  return (
    <SidebarWrapper>{children}</SidebarWrapper>
  );
};

export default Layout;