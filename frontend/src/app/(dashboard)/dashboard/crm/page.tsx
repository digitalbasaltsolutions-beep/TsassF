import { redirect } from 'next/navigation';

export default function CrmPage() {
  // By default, landing in CRM takes you to the Deals Pipeline
  redirect('/crm/deals');
}
