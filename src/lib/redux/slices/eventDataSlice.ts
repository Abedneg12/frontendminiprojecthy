import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventData } from '@/lib/interfaces/event.interface';

interface EventStatus {
  events: EventData[];
  currentEvent: EventData | null;
}

const getLocalStorageEvents = (): EventData[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    return JSON.parse(localStorage.getItem('events') || '[]');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return [];
  }
};

const initialState: EventStatus = {  
  events: getLocalStorageEvents(),
  currentEvent: null
};
  
export const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Omit<EventData, 'created_at' | 'updated_at' | 'remaining_seats'>>) => {
      const newEvent: EventData = {
          ...action.payload,
          total_seats: action.payload.total_seats,
          remaining_seats: 0
      };
      state.events.push(newEvent);
      localStorage.setItem('events', JSON.stringify(state.events));
    },
  }
});

export const { addEvent } = eventSlice.actions;
export default eventSlice.reducer;