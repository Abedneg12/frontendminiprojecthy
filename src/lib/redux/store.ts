import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import customerProfileReducer from './slices/customerProfileSlice';
import eventReducer from './slices/eventDataSlice';

export function makeStore() {
  return configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        customerProfile: customerProfileReducer,
        events: eventReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


