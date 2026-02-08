// Frontend API service for fetching offers

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Offer {
  _id: string;
  serviceName: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  couponCode: string;
  store: string;
  category: string;
  isActive: boolean;
  validityStartDate: string;
  validityEndDate: string;
  averageRating?: number;
  totalRatings?: number;
}

export interface TrendingOffersResponse {
  trending: Offer[];
}

export async function getTrendingOffers(limit: number = 8): Promise<Offer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/offers/trending?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending offers');
    }
    
    const data: TrendingOffersResponse = await response.json();
    return data.trending;
  } catch (error) {
    console.error('Error fetching trending offers:', error);
    return [];
  }
}

// Get all offers from database
export async function getAllOffersFromDB(limit: number = 12): Promise<Offer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/offers?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    
    const data = await response.json();
    return data.offers || [];
  } catch (error) {
    console.error('Error fetching offers:', error);
    return [];
  }
}

export async function getDealOfDay(): Promise<Offer | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/offers/deal-of-day`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch deal of day');
    }
    
    const data = await response.json();
    return data.deal;
  } catch (error) {
    console.error('Error fetching deal of day:', error);
    return null;
  }
}

export async function getFeaturedOffers(): Promise<Offer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/offers/featured`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured offers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured offers:', error);
    return [];
  }
}

export async function getAllOffers(page: number = 1, limit: number = 10): Promise<{ offers: Offer[]; total: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/offers?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching offers:', error);
    return { offers: [], total: 0 };
  }
}
