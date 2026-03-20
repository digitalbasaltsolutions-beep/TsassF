import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bashanssas — Business OS Platform',
  description: 'CRM, Ecommerce, Mobile Apps & Digital Solutions for modern businesses.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scroll-smooth antialiased selection:bg-blue-500/30">
      {children}
    </div>
  );
}
