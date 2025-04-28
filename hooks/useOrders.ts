import { useState, useEffect } from 'react';
import socket from '@/lib/socket';
import { getCustomerOrders, getPendingOrders, updateOrderStatus, getOrderHistory } from '@/lib/api';
import { debounce } from 'lodash';
import { toast } from 'sonner';

interface Order {
  _id: string;
  customerId: { _id: string; name: string };
  deliveryPartnerId?: { _id: string; name: string };
  product: string;
  quantity: number;
  status: string;
  location: string;
}

export const useOrders = (userId: string, role: 'customer' | 'delivery', view: 'dashboard' | 'history') => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let data;
      if (role === 'customer') {
        data = (await getCustomerOrders(userId)).data;
      } else if (role === 'delivery' && view === 'dashboard') {
        data = (await getPendingOrders()).data;
        console.log('Fetched active orders for dashboard:', data);
      } else if (role === 'delivery' && view === 'history') {
        data = (await getOrderHistory(userId)).data;
        console.log('Fetched history orders:', data);
      }
      if (data === null || !Array.isArray(data)) {
        console.warn(`Received invalid data for ${view} orders:`, data);
        data = [];
      }
      setOrders(data);
    } catch (error) {
      console.error(`Failed to fetch ${view} orders:`, error);
      toast( `Failed to fetch ${view} orders`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    socket.connect();
    socket.on('connect', () => console.log('Socket.io connected'));
    socket.on('connect_error', (err) => console.error('Socket.io error:', err));

    const updateOrders = debounce((updatedOrder: Order) => {
      console.log('Received orderUpdate:', updatedOrder);
      setOrders((prev) => {
        if (!prev) return [];
        if (role === 'delivery' && view === 'dashboard' && updatedOrder.status === 'Delivered') {
          const filtered = prev.filter((order) => order._id !== updatedOrder._id);
          console.log('Filtered dashboard orders:', filtered);
          return filtered;
        }
        if (role === 'delivery' && view === 'history' && updatedOrder.status === 'Delivered') {
          const existingOrder = prev.find((order) => order._id === updatedOrder._id);
          const updated = existingOrder
            ? prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
            : [updatedOrder, ...prev];
          console.log('Updated history orders:', updated);
          return updated;
        }
        const mapped = prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order));
        console.log('Mapped orders:', mapped);
        return mapped;
      });
    }, 100);

    socket.on('orderUpdate', updateOrders);

    return () => {
      socket.off('orderUpdate');
      socket.off('connect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [userId, role, view]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      console.log('Updating order:', orderId, 'to status:', status);
      await updateOrderStatus(orderId, status);
      console.log('Refetching orders after status update');
      await fetchOrders();
      toast( `Order updated to ${status}` );
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast( 'Failed to update order status');
    }
  };

  const fetchHistory = async () => {
    try {
      const { data } = await getOrderHistory(userId);
      console.log('Fetched history:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      toast('Failed to fetch order history');
      setOrders([]);
    }
  };

  return { orders, loading, fetchOrders, handleUpdateStatus, fetchHistory };
};