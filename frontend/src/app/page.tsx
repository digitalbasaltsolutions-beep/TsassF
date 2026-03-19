import { redirect } from 'next/navigation';

// Root "/" redirects to the landing page which is served from (landing)/page.tsx
// Next.js route groups don't collide, so we redirect from root to a clean path.
export default function RootPage() {
  redirect('/home');
}
