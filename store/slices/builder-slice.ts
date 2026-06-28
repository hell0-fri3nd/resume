import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Transient builder UI state. NOT persisted — it resets on reload by design.
interface BuilderState {
  isPreview: boolean;
}

const initialState: BuilderState = {
  isPreview: false,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    togglePreview: (state) => {
      state.isPreview = !state.isPreview;
    },
    setPreview: (state, action: PayloadAction<boolean>) => {
      state.isPreview = action.payload;
    },
  },
});

export const { togglePreview, setPreview } = builderSlice.actions;
export default builderSlice.reducer;
