'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User, Package, History } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  role: 'customer' | 'delivery';
}

export const Sidebar = ({ role }: SidebarProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); // For responsive toggle

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: `/${role}/dashboard`,
      icon: <Package className="w-5 h-5 mr-2" />,
    },
    {
      name: 'Orders',
      href: `/${role}/orders`,
      icon: <Package className="w-5 h-5 mr-2" />,
    },
    {
      name: 'Order History',
      href: `/${role}/history`,
      icon: <History className="w-5 h-5 mr-2" />,
    },
    {
      name: 'Profile',
      href: `/${role}/profile`,
      icon: <User className="w-5 h-5 mr-2" />,
    },
  ];

  return (
    <div
      className={`bg-gray-800 text-white h-screen ${
        isOpen ? 'w-64' : 'w-16'
      } transition-all duration-300 flex flex-col fixed md:static`}
    >
      {/* Toggle Button (for mobile) */}
      <div className="p-4 flex justify-between items-center">
        <h2 className={`text-lg font-bold ${isOpen ? 'block' : 'hidden'}`}>
          {role === 'customer' ? 'Customer' : 'Delivery'} Portal
        </h2>
        <Button
          variant="ghost"
          className="text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center p-4 hover:bg-gray-700 transition-colors"
              >
                {item.icon}
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full flex items-center text-white hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Logout</span>
        </Button>
      </div>
    </div>
  );
};