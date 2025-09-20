import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    data : []
}

const WorkLocationSlice = createSlice({
    name: "workLocationSlice",

    initialState,
    reducers : {
        resetState : (state) =>{
            
        },
        handleFetchData: (state, action) => {
            state.data = action.payload
        },
        handlePostData: (state, action) => {
            state.data.push(action.payload)
        },
        handleRemoveData: (state, action) => {
            state.data = state.data.filter(project => project?.id !== action.payload);
        },
        handleModifyData: (state, action) => {
            const updatedProject = action.payload;
            state.data = state.data.map(project => 
                project._id === updatedProject._id ? updatedProject : project
            );
        }
    }
})

export default WorkLocationSlice.reducer;
export const {resetState, handleFetchData, handlePostData, handleRemoveData, handleModifyData} = WorkLocationSlice.actions;