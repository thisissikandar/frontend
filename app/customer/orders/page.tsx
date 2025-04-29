'use client';
import { OrderTable } from '@/components/OrderTable';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomerOrders() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'customer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
   <div className="flex min-h-screen">
         {/* Sidebar */}
         <Sidebar role="customer" />
   
         {/* Main Content */}
         <div className="flex-1 p-6 ml-0 ">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <OrderTable userId={user._id} role="customer" />
      </div>
    </div>
  );
}