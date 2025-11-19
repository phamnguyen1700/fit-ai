import { notFound } from 'next/navigation';
import { CustomerDetail } from '@/features/advisor/customers/components/CustomerDetail';
import { findCustomerDetailById } from '@/features/advisor/customers/data';

interface CustomerDetailPageProps {
  params: { id: string };
}

export default function AdvisorCustomerDetailPage({ params }: CustomerDetailPageProps) {
  const customer = findCustomerDetailById(params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="p-2 sm:p-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <CustomerDetail customer={customer} />
      </div>
    </div>
  );
}

