import { createAppAsyncThunk } from '../utils/async-thunk'
import { createSlice, RootState } from '@reduxjs/toolkit'
import { ThunkExtra, Board, makeCallTx } from '@gno/redux'

export interface BoardsCreateState {
  boards: Board[]
  loading: boolean
  error?: string
  totalPosts?: number
  startIndex?: number
  endIndex?: number
}

const initialState = {
  boards: [] as Board[],
  loading: false,
  error: undefined,
  count: undefined,
  startIndex: undefined,
  endIndex: undefined
} as BoardsCreateState

export const boardsCreateSlice = createSlice({
  name: 'boardsCreate',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.loading = false
      console.log('createBoard.fulfilled', action.payload)
    })
    builder.addCase(createBoard.pending, (state) => {
      state.loading = true
      state.error = undefined
    })
    builder.addCase(createBoard.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
      console.error('createBoard.rejected', action.error)
    })
  },
  selectors: {
    selectBoards: (state: BoardsCreateState) => state.boards,
    selectBoardsLoading: (state: BoardsCreateState) => state.loading
  }
})

export interface BoardCreationData {
  boardName: string
  isPublic: boolean
}

export const createBoard = createAppAsyncThunk<string, BoardCreationData, ThunkExtra>(
  'boardsCreate/create',
  async (param, thunkAPI) => {
    const { boardName, isPublic } = param

    const callerAddressBech32 = (thunkAPI.getState() as RootState).account.account?.bech32

    const fnc = 'CreateBoard'
    const isListed = true
    const args: string[] = [boardName, isListed.toString(), isPublic.toString()]
    const gasFee = '100000ugnot'
    const gasWanted = BigInt(50000000)
    const reason = 'Creating a new board'

    return await makeCallTx({ fnc, args, gasFee, gasWanted, callerAddressBech32, reason }, thunkAPI.extra.gnonative)
  }
)
