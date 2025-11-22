import { CustomerDetail } from '@/features/advisor/customers/components/CustomerDetail';

interface CustomerDetailPageProps {
  params: { id: string };
}

export default function AdvisorCustomerDetailPage({ params }: CustomerDetailPageProps) {
  return (
    <div className="p-2 sm:p-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <CustomerDetail />
      </div>
    </div>
  );
}

