'use client';
import { OrderTable } from '@/components/OrderTable';
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <OrderTable userId={user._id} role="customer" />
    </div>
  );
}