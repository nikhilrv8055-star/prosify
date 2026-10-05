'use client';

import { useState, useEffect, useCallback } from 'react';
import { store, PAN_INDIA_CITIES } from '@/lib/data/store';
import { Property, Project, Developer, Lead, ChannelPartner, Unit, Booking, Commission } from '@/lib/types';

export function useLiveStore() {
  const [properties, setProperties] = useState<Property[]>(() => store.getProperties());
  const [projects, setProjects] = useState<Project[]>(() => store.getProjects());
  const [developers, setDevelopers] = useState<Developer[]>(() => store.getDevelopers());
  const [leads, setLeads] = useState<Lead[]>(() => store.getLeads());
  const [partners, setPartners] = useState<ChannelPartner[]>(() => store.getChannelPartners());
  const [units, setUnits] = useState<Unit[]>(() => store.getUnits());
  const [bookings, setBookings] = useState<Booking[]>(() => store.getBookings());
  const [commissions, setCommissions] = useState<Commission[]>(() => store.getCommissions());
  const [syncTimestamp, setSyncTimestamp] = useState<number>(0);

  const refresh = useCallback(() => {
    store.rehydrateFromStorage();
    setProperties([...store.getProperties()]);
    setProjects([...store.getProjects()]);
    setDevelopers([...store.getDevelopers()]);
    setLeads([...store.getLeads()]);
    setPartners([...store.getChannelPartners()]);
    setUnits([...store.getUnits()]);
    setBookings([...store.getBookings()]);
    setCommissions([...store.getCommissions()]);
    setSyncTimestamp(Date.now());
  }, []);

  useEffect(() => {
    // Rehydrate once on mount
    store.rehydrateFromStorage();

    // Subscribe to internal store emitter
    const unsubscribe = store.subscribe(() => {
      refresh();
    });

    // Listen to custom DOM event
    const handleStoreUpdated = () => {
      refresh();
    };
    window.addEventListener('prosify:store-updated', handleStoreUpdated);

    // Visibility change handler (re-sync when tab becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener('prosify:store-updated', handleStoreUpdated);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh]);

  return {
    properties,
    projects,
    developers,
    leads,
    partners,
    units,
    bookings,
    commissions,
    syncTimestamp,
    refresh,
    store,
    cities: PAN_INDIA_CITIES,
  };
}
