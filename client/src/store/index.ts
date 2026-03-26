import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducers from "./auth";


const reducer = combineReducers({
    auth: authReducers,
    
})

const store = configureStore({
    reducer
})

export type RootState = ReturnType<typeof store.getState>;

export default store;

//in this file we are creating the store and combining all the reducers and exporting the store to be used in the app. We are also exporting the RootState type to be used in the selectors.
//1. configureStore is a function that takes an object with a reducer property and returns a store.
//  The reducer property is a function that takes the current state and an action and returns the new state.
//  The combineReducers function is a helper function that takes an object with the reducers and returns a single reducer function that can be passed to the configureStore function.
//2. The RootState type is a type that represents the state of the store. 
// It is created using the ReturnType utility type, which takes a function and returns the type of its return value. 
// In this case, we are passing the getState function of the store, which returns the state of the store, so the RootState type will be the type of the state of the store.