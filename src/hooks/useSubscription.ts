import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type SubInfo = { 
  status?: string; 
  tier?: string; 
  periodEnd?: string;
  isActive?: boolean;
};

export function useSubscription() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<SubInfo>({});

  useEffect(() => {
    let mounted = true;
    
    const fetchSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        if (mounted) {
          setSub({ isActive: false }); 
          setLoading(false); 
        }
        return; 
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier, current_period_end')
        .eq('id', user.id)
        .single();

      if (!mounted) return;
      
      if (error) { 
        console.error('Error fetching subscription:', error);
        setSub({ isActive: false }); 
        setLoading(false); 
        return; 
      }

      const isActive = data?.subscription_status === 'active' || data?.subscription_status === 'trialing';
      
      setSub({
        status: data?.subscription_status ?? undefined,
        tier: data?.subscription_tier ?? undefined,
        periodEnd: data?.current_period_end ?? undefined,
        isActive
      });
      setLoading(false);
    };

    fetchSubscription();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchSubscription();
      } else {
        setSub({ isActive: false });
        setLoading(false);
      }
    });

    return () => { 
      mounted = false; 
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Checkout function for creating Stripe sessions
  const startCheckout = async (priceId: string, options?: {
    successUrl?: string;
    cancelUrl?: string;
    mode?: string;
  }) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated. Please sign in first.');
      }

      const supabaseBaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL?.replace(/\/$/, '') || '';
      const checkoutUrl = supabaseBaseUrl
        ? `${supabaseBaseUrl}/functions/v1/create-checkout`
        : '/functions/v1/create-checkout';

      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          successUrl: options?.successUrl || `${window.location.origin}/app`,
          cancelUrl: options?.cancelUrl || `${window.location.origin}/pricing`,
          mode: options?.mode || 'payment'
        })
      });

      if (!response.ok) {
        // Read body safely and surface full details
        let message = 'Failed to create checkout session';
        try {
          const text = await response.text();
          try {
            const errJson = JSON.parse(text);
            const parts = [errJson.error || errJson.message || message];
            if (errJson.code) parts.unshift(`[${errJson.code}]`);
            if (errJson.type) parts.unshift(`${errJson.type}`);
            message = parts.join(' ');
          } catch {
            // Not JSON, use raw text if present
            if (text) message = text;
          }
        } catch {}
        throw new Error(message);
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
      throw error;
    }
  };

  return { 
    loading, 
    sub,
    subscription: sub, // Alias for backward compatibility
    startCheckout
  };
}


