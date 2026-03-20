'use client';
export default function MarketingPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
      <p className="text-gray-500 mt-2">Welcome to your marketing automation hub.</p>
      
      <div className="mt-8 bg-pink-50 border border-pink-100 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-pink-800">Campaigns coming soon</h3>
        <p className="text-pink-600 mt-2 max-w-sm">We are actively building the marketing suite. Check back soon for updates!</p>
      </div>
    </div>
  );
}
