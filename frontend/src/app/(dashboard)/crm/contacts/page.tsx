'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await apiClient.get('/crm/contacts');
      setContacts(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/crm/contacts', { name, email, company: 'Not Specified', phone: '000000' });
      setName('');
      setEmail('');
      fetchContacts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendWA = async (id: string, contactName: string) => {
    const msg = window.prompt(`Message to send to ${contactName} via WhatsApp:`);
    if (!msg) return;
    try {
      await apiClient.post(`/crm/contacts/${id}/whatsapp`, { message: msg });
      alert('Message mock sent successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to send message.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleAddContact} className="flex space-x-4">
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="flex-1 border rounded-md px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 border rounded-md px-3 py-2 text-sm" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Add Contact</button>
        </form>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.map((contact: any) => (
              <tr key={contact._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{contact.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleSendWA(contact._id, contact.name)} className="text-green-600 hover:text-green-800 font-bold">
                    WhatsApp
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No contacts found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
