import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appliedEvents: [],
  loading: false,
  error: null,
};

const appliedSlice = createSlice({
  name: 'applied',
  initialState,
  reducers: {
    // Add a new applied event
    addAppliedEvent: (state, action) => {
      const newEvent = {
        id: action.payload.id,
        location: action.payload.location,
        budget: action.payload.budget,
        time: action.payload.time,
        genres: action.payload.genres || [],
        rating: action.payload.rating || 0,
        status: 'pending', // Default status when applying
        image: action.payload.image,
        appliedAt: new Date().toISOString(),
        eventId: action.payload.eventId,
        venueName: action.payload.venueName,
        dateMonth: action.payload.dateMonth,
        dateDay: action.payload.dateDay,
      };
      
      // Check if event is already applied
      const existingIndex = state.appliedEvents.findIndex(event => event.id === newEvent.id);
      if (existingIndex === -1) {
        state.appliedEvents.unshift(newEvent); // Add to beginning of array
      }
    },

    // Remove an applied event
    removeAppliedEvent: (state, action) => {
      state.appliedEvents = state.appliedEvents.filter(event => event.id !== action.payload);
    },

    // Update status of an applied event
    updateEventStatus: (state, action) => {
      const { eventId, status } = action.payload;
      const eventIndex = state.appliedEvents.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        state.appliedEvents[eventIndex].status = status;
      }
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear all applied events (for logout)
    clearAppliedEvents: (state) => {
      state.appliedEvents = [];
    },

    // Update multiple events (for API sync)
    updateAppliedEvents: (state, action) => {
      state.appliedEvents = action.payload;
    },
  },
});

export const {
  addAppliedEvent,
  removeAppliedEvent,
  updateEventStatus,
  setLoading,
  setError,
  clearError,
  clearAppliedEvents,
  updateAppliedEvents,
} = appliedSlice.actions;

// Selectors
export const selectAppliedEvents = (state) => state.applied.appliedEvents;
export const selectAppliedEventsLoading = (state) => state.applied.loading;
export const selectAppliedEventsError = (state) => state.applied.error;
export const selectAppliedEventsCount = (state) => state.applied.appliedEvents.length;
export const selectEventById = (state, eventId) => 
  state.applied.appliedEvents.find(event => event.id === eventId);

export default appliedSlice.reducer; 