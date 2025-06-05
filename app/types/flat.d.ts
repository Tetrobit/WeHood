export interface IFlat {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  distance: number; // в метрах
  images: string[];
  rooms: number;
  area: number; // в м²
  floor: number;
  totalFloors: number;
  views: number;
  currentViewers: number;
  createdAt: string;
  landlord: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
  };
}

export interface IReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IFlatDetails extends IFlat {
  reviews: IReview[];
}

export default IFlat;
