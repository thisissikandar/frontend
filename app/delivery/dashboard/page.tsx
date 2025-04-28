'use client';
import { OrderTable } from '@/components/OrderTable';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DeliveryDashboard() {
  const { user, loading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders(user?._id || '', 'delivery', 'dashboard');
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'delivery')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || ordersLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Delivery Partner Dashboard</h1>
      <OrderTable userId={user._id} role="delivery" />
    </div>
  );
}