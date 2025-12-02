// Temporary compatibility file for old apiRequest imports
// This provides mock functions until all files are updated to use static data

export async function apiRequest(url: string): Promise<any> {
  // Mock API responses based on the URL
  const mockDelay = () => new Promise(resolve => setTimeout(resolve, 200));
  
  await mockDelay();
  
  // Return mock data based on the endpoint
  if (url.includes('/api/auth/session')) {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
  
  if (url.includes('/api/auth/logout')) {
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
    return { message: 'Logged out' };
  }
  
  if (url.includes('/api/accommodations')) {
    const { mockAccommodations } = await import('@/data/mockData');
    return mockAccommodations;
  }
  
  if (url.includes('/api/bookings')) {
    const { mockBookings } = await import('@/data/mockData');
    return mockBookings;
  }
  
  // Default empty response
  return {};
}

// Mock React Query hooks for compatibility
export function useMutation(config: any) {
  return {
    mutate: async (data: any) => {
      try {
        const result = await config.mutationFn(data);
        if (config.onSuccess) config.onSuccess(result);
      } catch (error) {
        if (config.onError) config.onError(error);
      } finally {
        if (config.onSettled) config.onSettled();
      }
    },
    isLoading: false,
    isError: false,
  };
}

export function useQuery() {
  return {
    data: null,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}

export function useQueryClient() {
  return {
    invalidateQueries: () => {},
  };
}