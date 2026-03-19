import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bashanssas — Business OS Platform',
  description: 'CRM, Ecommerce, Mobile Apps & Digital Solutions for modern businesses.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
