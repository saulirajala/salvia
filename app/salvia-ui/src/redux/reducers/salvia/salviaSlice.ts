import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SalviaTest } from '../../../types/SalviaTest'
import { RootState } from '../../store'
import { getSalviaTests } from './salviaAPI'

export interface SalviaState {
  test: string
  status: 'idle' | 'loading' | 'ready'
  response: 'ok' | 'failed' | undefined
  tests: SalviaTest[]
}

const initialState: SalviaState = {
  test: '',
  status: 'idle',
  response: undefined,
  tests: [],
}

export const getTests = createAsyncThunk('salvia/getTests', async () => {
  const response = await getSalviaTests()

  return response
})

export const salviaSlice = createSlice({
  name: 'salvia',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getTests.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getTests.fulfilled, (state, action) => {
        state.status = 'ready'
        state.tests = action.payload
      })
      .addCase(getTests.rejected, (state) => {
        state.status = 'ready'
        state.response = 'ok'
      })
  },
})

export const selectResponse = (state: RootState) => state.salvia.response
export const selectStatus = (state: RootState) => state.salvia.status
export const selectTests = (state: RootState) => state.salvia.tests
export const selectTest = (state: RootState) => state.salvia.test

export default salviaSlice.reducer
