'use client';
import { OrderForm } from '@/components/OrderForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomerDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'customer')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading... </p>;
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
      <div className="max-w-md">
        <OrderForm onSuccess={() => {}} />
      </div>
    </div>
  );
}