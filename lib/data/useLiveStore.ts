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
  const [isLoadingServerData, setIsLoadingServerData] = useState<boolean>(false);

  const refreshLocalState = useCallback(() => {
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

  // Fetch latest persistent changes from server
  const syncWithServer = useCallback(async () => {
    try {
      setIsLoadingServerData(true);
      const [propsRes, projsRes, devsRes] = await Promise.all([
        fetch('/api/admin/properties', { cache: 'no-store' }),
        fetch('/api/admin/projects', { cache: 'no-store' }),
        fetch('/api/admin/developers', { cache: 'no-store' }),
      ]);

      let hasUpdates = false;
      const payload: { properties?: Property[]; projects?: Project[]; developers?: Developer[] } = {};

      if (propsRes.ok) {
        const propsData = await propsRes.json();
        if (propsData?.properties && Array.isArray(propsData.properties)) {
          payload.properties = propsData.properties;
          hasUpdates = true;
        }
      }

      if (projsRes.ok) {
        const projsData = await projsRes.json();
        if (projsData?.projects && Array.isArray(projsData.projects)) {
          payload.projects = projsData.projects;
          hasUpdates = true;
        }
      }

      if (devsRes.ok) {
        const devsData = await devsRes.json();
        if (devsData?.developers && Array.isArray(devsData.developers)) {
          payload.developers = devsData.developers;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        store.syncFromExternalData(payload);
        setProperties([...store.getProperties()]);
        setProjects([...store.getProjects()]);
        setDevelopers([...store.getDevelopers()]);
        setSyncTimestamp(Date.now());
      }
    } catch (err) {
      console.warn('[useLiveStore] Server sync notice:', err);
    } finally {
      setIsLoadingServerData(false);
    }
  }, []);

  useEffect(() => {
    // 1. Rehydrate from local cache immediately
    store.rehydrateFromStorage();

    // 2. Fetch fresh persistent server data
    syncWithServer();

    // 3. Subscribe to internal store emitter
    const unsubscribe = store.subscribe(() => {
      refreshLocalState();
    });

    // 4. Listen to custom DOM event
    const handleStoreUpdated = () => {
      refreshLocalState();
    };
    window.addEventListener('prosify:store-updated', handleStoreUpdated);

    // 5. Visibility change handler (re-sync when tab becomes visible)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshLocalState();
        syncWithServer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 6. Polling interval (every 20s to capture background admin edits)
    const interval = setInterval(() => {
      syncWithServer();
    }, 20000);

    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('prosify:store-updated', handleStoreUpdated);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshLocalState, syncWithServer]);

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
    isLoadingServerData,
    refresh: refreshLocalState,
    syncWithServer,
    store,
    cities: PAN_INDIA_CITIES,
  };
}
