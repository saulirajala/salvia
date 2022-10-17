import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Viewport } from '../../../types/SalviaTest'
import { RootState } from '../../store'
import { fetchPages } from './crawlerAPI'

export interface CrawlerState {
  pages: string[]
  status: 'idle' | 'loading' | 'failed'
}

const initialState: CrawlerState = {
  pages: [],
  status: 'idle',
}

interface CrawlerParameters {
  url: string
  depth: number
  width: number
  viewport: Viewport
}

export const crawlDomain = createAsyncThunk(
  'crawler/fetchPages',
  async (crawlerParameters: CrawlerParameters) => {
    const { url, depth, width, viewport } = crawlerParameters
    const response = await fetchPages(url, depth, width, viewport)

    return response.data
  },
)

export const crawlerSlice = createSlice({
  name: 'crawler',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    //reset state to initial state
    resetCrawler: (state) => {
      state.pages = []
      state.status = 'idle'
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(crawlDomain.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(crawlDomain.fulfilled, (state, action) => {
        state.status = 'idle'
        state.pages = action.payload
      })
      .addCase(crawlDomain.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { resetCrawler } = crawlerSlice.actions

export const selectPages = (state: RootState) => state.crawler.pages
export const selectStatus = (state: RootState) => state.crawler.status

export default crawlerSlice.reducer
