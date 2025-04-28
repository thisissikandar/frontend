'use client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrders } from '@/hooks/useOrders';

interface OrderTableProps {
  userId: string;
  role: 'customer' | 'delivery';
}

export const OrderTable = ({ userId, role }: OrderTableProps) => {
  const { orders, loading, handleUpdateStatus } = useOrders(userId, role, role === 'delivery' ? 'dashboard' : 'history');

  if (loading) return <p>Loading...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          {role === 'delivery' && <TableHead>Customer</TableHead>}
          {role === 'customer' && <TableHead>Delivery Partner</TableHead>}
          {role === 'delivery' && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order._id}</TableCell>
            <TableCell>{order.product}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{order.location}</TableCell>
            <TableCell>{order.status}</TableCell>
            {role === 'delivery' && <TableCell>{order.customerId.name}</TableCell>}
            {role === 'customer' && (
              <TableCell>{order.deliveryPartnerId?.name || 'Not assigned'}</TableCell>
            )}
            {role === 'delivery' && (
              <TableCell className="space-x-2">
                {order.status === 'Pending' && (
                  <Button onClick={() => handleUpdateStatus(order._id, 'Accepted')}>
                    Accept
                  </Button>
                )}
                {order.status === 'Accepted' && (
                  <Button onClick={() => handleUpdateStatus(order._id, 'Out for Delivery')}>
                    Out for Delivery
                  </Button>
                )}
                {order.status === 'Out for Delivery' && (
                  <Button onClick={() => handleUpdateStatus(order._id, 'Delivered')}>
                    Delivered
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};