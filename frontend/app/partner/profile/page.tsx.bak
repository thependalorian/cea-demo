import dynamic from 'next/dynamic';

const PartnerProfileForm = dynamic(() => import('@/components/partner/PartnerProfileForm'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 text-base text-gray-400">Loading partner profile form...</div>
});

export default function PartnerProfilePage() {
  return <PartnerProfileForm />;
}
