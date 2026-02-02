// Rating & Review Types

export interface Rating {
  _id: string;
  offerId: string;
  userId: string;
  user?: UserInfo;
  rating: number;
  review?: string;
  images?: string[];
  isHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  avatar?: string;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  percentageDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface RatingSubmission {
  offerId: string;
  rating: number;
  review?: string;
  images?: string[];
}

export interface ReviewSortOption = 'recent' | 'highest' | 'lowest' | 'helpful';
