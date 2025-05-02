import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import { profile } from "console";
import customerProfileReducer from './slices/customerProfileSlice';

export function makeStore() {
  return configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        customerProfile: customerProfileReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


