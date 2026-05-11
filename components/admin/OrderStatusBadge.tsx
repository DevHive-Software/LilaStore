import { getOrderStatusLabel, getOrderStatusColor, cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
        getOrderStatusColor(status),
        className
      )}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}
