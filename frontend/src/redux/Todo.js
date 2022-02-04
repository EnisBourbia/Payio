import { createSlice } from '@reduxjs/toolkit'

export const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    todo: {}
    },
  reducers: {
    setTodo: (state, action) => {
      state.todo = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTodo } = todoSlice.actions

export default todoSlice.reducer