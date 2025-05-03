import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CustomerProfileState } from '@/lib/interfaces/auth.interface.user';



// Async thunk untuk mengambil data profil dari backend
export const fetchCustomerProfile = createAsyncThunk(
  'customerProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me/customer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal mengambil profil');
      }

      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Gagal mengambil profil');
    }
  }
);

const initialState: CustomerProfileState = {
  loading: false,
  data: null,
  error: null,
};

const customerProfileSlice = createSlice({
  name: 'customerProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action: PayloadAction<CustomerProfileState['data']>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default customerProfileSlice.reducer;
