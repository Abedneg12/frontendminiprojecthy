// lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import OrganizerProfileReducer from './slices/OrganizerProfileSlice';
import customerProfileReducer from './slices/customerProfileSlice';
import eventReducer from './slices/eventDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    OrganizerProfile: OrganizerProfileReducer,
    customerProfile: customerProfileReducer,
    events: eventReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
