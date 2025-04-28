'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createOrder } from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  location: z.string().min(1, 'Location is required'),
});

interface OrderFormProps {
  onSuccess: () => void;
}

export const OrderForm = ({ onSuccess }: OrderFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { product: '', quantity: 1, location: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createOrder(values);
      toast( 'Order placed successfully' );
      form.reset();
      onSuccess();
    } catch (error) {
      toast('Failed to place order');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantity"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Delivery location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Place Order</Button>
      </form>
    </Form>
  );
};