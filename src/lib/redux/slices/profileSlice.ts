import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState } from '@/lib/interfaces/auth.interface.user';


const initialState: ProfileState = {
  full_name: '',
  email: '',
  referral_code: '',
  is_verified: false,
  profile_picture: '',
  points: 0,
  coupons: [],
  vouchers: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setCustomerProfile: (state, action: PayloadAction<ProfileState>) => {
      return { ...state, ...action.payload };
    },
    updateProfileData: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCustomerProfile, updateProfileData } = profileSlice.actions;
export default profileSlice.reducer;
