import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export interface UsageData {
  plan: string;
  usage: {
    contacts: number;
    deals: number;
    members: number;
  };
  limits: {
    contacts: number;
    deals: number;
    members: number;
  };
  isNearLimit: {
    contacts: boolean;
    deals: boolean;
    members: boolean;
  };
}

export const useUsage = () => {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    try {
      const response = await apiClient.get('/billing/usage');
      setUsage(response.data);
    } catch (error) {
      console.error('Failed to fetch usage', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    // Poll every 30s to keep it fresh
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  return { usage, loading, refresh: fetchUsage };
};
