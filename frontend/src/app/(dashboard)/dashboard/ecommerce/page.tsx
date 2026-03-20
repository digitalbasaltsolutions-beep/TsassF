'use client';
export default function EcommercePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900">E-Commerce Overview</h1>
      <p className="text-gray-500 mt-2">Manage your inventory and orders centrally.</p>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-blue-800">Advanced store management coming soon</h3>
        <p className="text-blue-600 mt-2 max-w-sm">Use the left sidebar to navigate to Orders and Products.</p>
      </div>
    </div>
  );
}
