import { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      MainLayout
      {children}
    </div>
  );
};

export default MainLayout;
