import { useState, useEffect } from 'react';

export function useEthPrice() {
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch ETH price');
      }
      
      const data = await response.json();
      setEthPrice(data.ethereum.usd);
      setError(null);
    } catch (err) {
      console.error('Error fetching ETH price:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch ETH price'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEthPrice();

    // Set up interval for refreshing price
    const intervalId = setInterval(fetchEthPrice, 60000); // Refresh every 60 seconds

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return { ethPrice, isLoading, error, refresh: fetchEthPrice };
}
