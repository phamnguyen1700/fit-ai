import { CustomerDetail } from '@/features/advisor/customers/components/CustomerDetail';


export default function AdvisorCustomerDetailPage() {
  return (
    <div className="p-2 sm:p-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <CustomerDetail />
      </div>
    </div>
  );
}

