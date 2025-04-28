'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <div>
          <Link href="/" className="text-lg font-bold">
            Delivery App
          </Link>
        </div>
        <div className="space-x-4">
          {user ? (
            <>
              {user.role === 'customer' ? (
                <>
                  <Link href="/customer/dashboard">Dashboard</Link>
                  <Link href="/customer/orders">Orders</Link>
                  <Link href="/customer/history">History</Link>
                </>
              ) : (
                <>
                  <Link href="/delivery/dashboard">Dashboard</Link>
                  <Link href="/delivery/history">History</Link>
                </>
              )}
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};