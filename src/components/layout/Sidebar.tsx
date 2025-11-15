import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Bed,
  Calendar,
  LogIn,
  LogOut as LogOutIcon,
  Briefcase,
  Users,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { logoutUser } from '@/redux/slices/auth.slice';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Rooms',
    icon: Home,
    items: [
      { title: 'Room Types', path: '/room-types' },
      { title: 'Rooms', path: '/rooms' },
    ],
  },
  {
    title: 'Reservations',
    icon: Calendar,
    items: [
      { title: 'Reservations', path: '/reservations' },
      { title: 'Check-in', path: '/check-in' },
      { title: 'Check-out', path: '/check-out' },
    ],
  },
  {
    title: 'Services',
    icon: Briefcase,
    path: '/services',
  },
  {
    title: 'Reports',
    icon: FileText,
    items: [{ title: 'Invoices', path: '/invoices' }],
  },
  {
    title: 'Admin',
    icon: Users,
    items: [{ title: 'Employees', path: '/employees' }],
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      {/* Logo/Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Room Master</h1>
        <p className="text-sm text-muted-foreground">Hotel Management</p>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedGroups.includes(item.title);
            const isActive = item.path
              ? location.pathname === item.path
              : item.items?.some((subItem) => location.pathname === subItem.path);

            if (item.path) {
              // Single item
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            }

            // Group with sub-items
            return (
              <li key={item.title}>
                <button
                  onClick={() => toggleGroup(item.title)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.title}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isExpanded && item.items && (
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.items.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-sm transition-colors',
                            location.pathname === subItem.path
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator />

      {/* User Info & Logout */}
      <div className="p-4">
        <div className="mb-3 rounded-lg bg-accent p-3">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

