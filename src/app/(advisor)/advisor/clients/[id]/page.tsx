import { ClientDetail } from '@/features/advisor/advisor-clients/detail';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return <ClientDetail clientId={params.id} />;
}
