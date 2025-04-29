'use client';
import { OrderTable } from '@/components/OrderTable';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeliveryHistory() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { orders, loading: ordersLoading } = useOrders(user?._id || '', 'delivery', 'history');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'delivery')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="flex min-h-screen">
    {/* Sidebar */}
    <Sidebar role="delivery" />

    {/* Main Content */}
    <div className="flex-1 p-6 ml-0 ">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      <OrderTable userId={user._id} role="delivery" />
    </div>
  </div>
  );
}