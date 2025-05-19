// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { EventData, EventStatus } from '@/lib/interfaces/event.interface';

// const isBrowser = typeof window !== 'undefined';

// const loadInitialEvents = (): EventData[] => {
//   if (isBrowser) {
//     try {
//       const stored = localStorage.getItem('events');
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   }
//   return [];
// };

// const initialState: EventStatus = {
//   events: loadInitialEvents(),
//   currentEvent: null,
// };

// export const eventSlice = createSlice({
//   name: 'events',
//   initialState,
//   reducers: {
//     addEvent: (
//       state,
//       action: PayloadAction<Omit<EventData, 'id' | 'created_at' | 'updated_at' | 'remaining_seats'>>
//     ) => {
//       const newEvent: EventData = {
//         ...action.payload,
//         id: Date.now(),
//         remaining_seats: action.payload.total_seats,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       };

//       state.events.push(newEvent);

//       if (isBrowser) {
//         localStorage.setItem('events', JSON.stringify(state.events));
//       }
//     },

//     setCurrentEvent: (state, action: PayloadAction<number>) => {
//       state.currentEvent = state.events.find((e) => e.id === action.payload) || null;
//     },

//     updateRemainingSeats: (state, action: PayloadAction<{ id: number; seats: number }>) => {
//       const event = state.events.find((e) => e.id === action.payload.id);
//       if (event) {
//         event.remaining_seats = action.payload.seats;
//         if (isBrowser) {
//           localStorage.setItem('events', JSON.stringify(state.events));
//         }
//       }
//     },
//   },
// });

// export const { addEvent, setCurrentEvent, updateRemainingSeats } = eventSlice.actions;
// export default eventSlice.reducer;
