// ─── src/hooks/useDisruptions.js ─────────────────────────────────────────────
// Custom hook: manages live disruption scanning with auto-refresh

import { useState, useEffect, useCallback } from "react";
import { fetchDisruptionData } from "../utils/apiService";

/**
 * useDisruptions
 * Fetches and manages live disruption data for a city/platform/zone.
 * Auto-refreshes every 5 minutes.
 *
 * @param {string} city
 * @param {string} platform
 * @param {string} zone
 * @returns {Object} { data, loading, error, rescan, lastScan }
 */
export function useDisruptions(city, platform, zone) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastScan, setLastScan] = useState(null);

  const rescan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDisruptionData(city, platform, zone);
      setData(result);
      setLastScan(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      setError("Failed to fetch disruption data. Retrying...");
    } finally {
      setLoading(false);
    }
  }, [city, platform, zone]);

  // Initial fetch
  useEffect(() => {
    if (city) rescan();
  }, [city, platform, zone]);

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (city) rescan();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [rescan]);

  return { data, loading, error, rescan, lastScan };
}
