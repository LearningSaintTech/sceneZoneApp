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
    addAppliedEvent: (state, action) => {
      console.log('addAppliedEvent - Action Payload:', action.payload);
      console.log('addAppliedEvent - Current State:', state);
      const newEvent = {
        id: action.payload.id,
        location: action.payload.location,
        budget: action.payload.budget,
        time: action.payload.time,
        genres: action.payload.genres || [],
        rating: action.payload.rating || 0,
        status: 'pending',
        image: action.payload.image,
        appliedAt: new Date().toISOString(),
        eventId: action.payload.eventId,
        venueName: action.payload.venueName,
        dateMonth: action.payload.dateMonth,
        dateDay: action.payload.dateDay,
      };
      
      const existingIndex = state.appliedEvents.findIndex(event => event.id === newEvent.id);
      console.log('addAppliedEvent - Existing Index:', existingIndex);
      if (existingIndex === -1) {
        state.appliedEvents.unshift(newEvent);
        console.log('addAppliedEvent - New Event Added:', newEvent);
      }
      console.log('addAppliedEvent - Updated State:', state);
    },

    removeAppliedEvent: (state, action) => {
      console.log('removeAppliedEvent - Action Payload:', action.payload);
      console.log('removeAppliedEvent - Current State:', state);
      state.appliedEvents = state.appliedEvents.filter(event => event.id !== action.payload);
      console.log('removeAppliedEvent - Updated State:', state);
    },

    updateEventStatus: (state, action) => {
      console.log('updateEventStatus - Action Payload:', action.payload);
      console.log('updateEventStatus - Current State:', state);
      const { eventId, status } = action.payload;
      const eventIndex = state.appliedEvents.findIndex(event => event.id === eventId);
      console.log('updateEventStatus - Event Index:', eventIndex);
      if (eventIndex !== -1) {
        state.appliedEvents[eventIndex].status = status;
        console.log('updateEventStatus - Updated Event:', state.appliedEvents[eventIndex]);
      }
      console.log('updateEventStatus - Updated State:', state);
    },

    setLoading: (state, action) => {
      console.log('setLoading - Action Payload:', action.payload);
      console.log('setLoading - Current State:', state);
      state.loading = action.payload;
      console.log('setLoading - Updated State:', state);
    },

    setError: (state, action) => {
      console.log('setError - Action Payload:', action.payload);
      console.log('setError - Current State:', state);
      state.error = action.payload;
      console.log('setError - Updated State:', state);
    },

    clearError: (state) => {
      console.log('clearError - Current State:', state);
      state.error = null;
      console.log('clearError - Updated State:', state);
    },

    clearAppliedEvents: (state) => {
      console.log('clearAppliedEvents - Current State:', state);
      state.appliedEvents = [];
      console.log('clearAppliedEvents - Updated State:', state);
    },

    updateAppliedEvents: (state, action) => {
      console.log('updateAppliedEvents - Action Payload:', action.payload);
      console.log('updateAppliedEvents - Current State:', state);
      state.appliedEvents = action.payload;
      console.log('updateAppliedEvents - Updated State:', state);
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

export const selectAppliedEvents = (state) => state.applied.appliedEvents;
export const selectAppliedEventsLoading = (state) => state.applied.loading;
export const selectAppliedEventsError = (state) => state.applied.error;
export const selectAppliedEventsCount = (state) => state.applied.appliedEvents.length;
export const selectEventById = (state, eventId) => 
  state.applied.appliedEvents.find(event => event.id === eventId);

export default appliedSlice.reducer;