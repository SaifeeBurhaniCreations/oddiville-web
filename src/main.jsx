import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import AdminDataSlice from './redux/AdminDataSlice.js'
import WorkLocationSlice from './redux/WorkLocationSlice.js'
import LaneDataSlice from './redux/LaneDataSlice.js'
import ServiceDataSlice from './redux/ServiceDataSlice.js'
import RawMaterialDataSlice from './redux/RawMaterialDataSlice.js'
import OtherProductSlice from './redux/OtherProductSlice.js'

const rootReducer = combineReducers({ AdminDataSlice, location: WorkLocationSlice, lane: LaneDataSlice, ServiceDataSlice, rm: RawMaterialDataSlice, otherProduct: OtherProductSlice });
const store = configureStore({
  reducer : rootReducer
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
