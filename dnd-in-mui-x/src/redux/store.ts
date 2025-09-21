import { combineReducers, configureStore, type Middleware } from "@reduxjs/toolkit";
import combinedApiMiddleware from "./api/combinedApiMiddleware";
import dummyJsonApi from "./api/dummyJsonApi";

const middleware = [...combinedApiMiddleware] as Middleware[];

const store = configureStore({
    reducer: combineReducers({[dummyJsonApi.reducerPath]: dummyJsonApi.reducer}),
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;