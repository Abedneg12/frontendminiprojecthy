import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OgranizerProfileState } from '@/lib/interfaces/auth.interface.user';



// Async thunk untuk mengambil data profil dari backend
export const fetchOgranizerProfile = createAsyncThunk(
  'organizerProfile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me/organizer`, {
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

const initialState: OgranizerProfileState = {
  loading: false,
  data: null,
  error: null,
};

const OrganizerProfileSlice = createSlice({
  name: 'OrganizerProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOgranizerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOgranizerProfile.fulfilled, (state, action: PayloadAction<OgranizerProfileState['data']>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOgranizerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default OrganizerProfileSlice.reducer;
