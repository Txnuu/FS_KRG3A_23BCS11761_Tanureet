import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logs as logsData } from "../data/logs";

export const fetchLogs = createAsyncThunk(
  "logs/fetchLogs",
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return logsData;
  }
);

const logsSlice = createSlice({
  name: "logs",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLogs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLogs.rejected, state => {
        state.loading = false;
        state.error = "Failed to fetch logs";
      });
  },
});

export default logsSlice.reducer;
