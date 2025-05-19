export interface EventData {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  category: 'FESTIVAL' | 'MUSIC' | 'ART' | 'EDUCATION';
  location: string;
  paid: boolean;
  price: number;
  total_seats: number;
  remaining_seats: number;
  start_date: string;
  end_date: string;
  image_url?: string;
}

export interface EventStatus {
  events: EventData[];
  currentEvent: EventData | null;
}
