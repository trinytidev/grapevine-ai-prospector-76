import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Lead = Tables<'leads'>;
export type LeadInsert = TablesInsert<'leads'>;

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLeads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching leads",
        description: "Failed to load your leads. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLead = async (leadData: Omit<LeadInsert, 'user_id' | 'id'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          ...leadData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setLeads(prev => [data, ...prev]);
      toast({
        title: "Lead created successfully!",
        description: "Your new lead has been added to the list.",
      });

      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating lead",
        description: "Failed to create the lead. Please try again.",
      });
      return null;
    }
  };

  const updateLead = async (id: string, updates: Partial<Omit<LeadInsert, 'user_id' | 'id'>>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setLeads(prev => prev.map(lead => lead.id === id ? data : lead));
      toast({
        title: "Lead updated successfully!",
        description: "Your lead has been updated.",
      });

      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating lead",
        description: "Failed to update the lead. Please try again.",
      });
      return null;
    }
  };

  const deleteLead = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== id));
      toast({
        title: "Lead deleted successfully!",
        description: "The lead has been removed from your list.",
      });

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting lead",
        description: "Failed to delete the lead. Please try again.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  return {
    leads,
    loading,
    createLead,
    updateLead,
    deleteLead,
    refetch: fetchLeads,
  };
};