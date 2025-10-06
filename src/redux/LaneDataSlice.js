import { createSlice } from "@reduxjs/toolkit";
// import { log } from "console";

const laneSlice = createSlice({
    name: "lane",
    initialState: {
        data: [],
    },
    reducers: {
        handleFetchData: (state, action) => {
            state.data = action.payload;
        },

        handlePostData: (state, action) => {
            state.data.push(action.payload);
        },

        handleModifyData: (state, action) => { const updatedProject = action.payload; state.data = state.data.map(project => project.id === updatedProject.id ? updatedProject : project); },

        // handleModifyData: (state, action) => {
        //     console.log(action.payload)
        //     console.log(state.data.map(val=>val.id == action.payload.id))
        //     // console.log(state.data)
        //     const updated = action.payload;
        //     state.data = state.data.map(item =>
        //         item.id == updated.id
        //             ? { ...item, ...updated }
        //             : item
        //     );
        // },


        handleDeleteData: (state, action) => {
            const id = action.payload;
            state.data = state.data.filter(
                (lane) => (lane._id || lane.id) !== id
            );
        },
    },
});

export const {
    handleFetchData,
    handlePostData,
    handleModifyData,
    handleDeleteData,
} = laneSlice.actions;

export default laneSlice.reducer;
