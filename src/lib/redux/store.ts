import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import OrganizerProfileReducer from './slices/OrganizerProfileSlice';
import customerProfileReducer from './slices/customerProfileSlice';


export function makeStore() {
  return configureStore({
    reducer: {
        auth: authReducer,
        OrganizerProfile: OrganizerProfileReducer,
        customerProfile: customerProfileReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];


