'use client';

import { useState, useEffect } from 'react';
import { dbHelper } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function test() {
      try {
        setStatus('Fetching from dbHelper...');
        const acts = await dbHelper.getActivities();
        const settings = await dbHelper.getSystemSettings();
        setData({
          activitiesCount: acts.length,
          activities: acts,
          settings
        });
        setStatus('Success');
      } catch (err: any) {
        setStatus('Error: ' + err.message);
        setData({ error: String(err) });
      }
    }
    test();
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#fff', minHeight: '100vh', color: '#000' }}>
      <h1>Supabase Client Connection Test</h1>
      <p>Status: {status}</p>
      <pre style={{ background: '#f4f4f4', padding: 20, borderRadius: 8, overflow: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
