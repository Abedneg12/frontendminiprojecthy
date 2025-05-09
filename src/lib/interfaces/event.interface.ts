export interface event {
    name: string;
    description: string;
    category: 'MUSIC' | 'ART'|'FESTIVAL'|'EDUCATION';
    location: string;
    paid: boolean;
    price: number;
    start_date: Date;
    end_date: Date;
    total_seats: number;
  }