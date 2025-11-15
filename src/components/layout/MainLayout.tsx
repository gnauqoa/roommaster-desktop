import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store';
import { checkAuth } from '@/redux/slices/auth.slice';

export const MainLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        <Outlet />
      </main>
    </div>
  );
};

