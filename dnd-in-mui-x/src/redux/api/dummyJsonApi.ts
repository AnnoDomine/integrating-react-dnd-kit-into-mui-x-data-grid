import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PaginatedRequestParams } from "./default.types";

type Reaction = {
  likes: number;
  dislikes: number;
};

type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: Reaction;
  views: number;
  userId: number;
  rowId?: number; // Add rowId field for MUI DataGrid
  initialIndex?: number; // For tracking original index during drag-and-drop
};

type Recipes = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
  rowId?: number; // Add rowId field for MUI DataGrid
};

export type Response<D> = D & {
  total: number;
  skip: number;
  limit: number;
};

export type PostsResponse = {
  posts: Post[];
};

export type RecipesResponse = {
  recipes: Recipes[];
};

const dummyJsonApi = createApi({
  reducerPath: "dummyJsonApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/" }),
  tagTypes: ["Post", "Recipe"],
  endpoints: (builder) => ({
    getPosts: builder.query<Response<PostsResponse>, PaginatedRequestParams | void>({
      query: (params) => ({
        url: "posts",
        params: { ...(params || {}), delay: 500 },
      }),
      transformResponse: (response: Response<PostsResponse>) => {
        const transformedPosts = response.posts.map((post, index) => ({
          ...post,
          rowId: post.id, // Add rowId field for MUI DataGrid
          initialIndex: index + 1, // Add initialIndex field for tracking original index
        }));
        return { ...response, posts: transformedPosts };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getRecipes: builder.query<Response<RecipesResponse>,  PaginatedRequestParams | void>({
      query: (params) => ({
        url: "recipes",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.recipes.map(({ id }) => ({
                type: "Recipe" as const,
                id,
              })),
              { type: "Recipe", id: "LIST" },
            ]
          : [{ type: "Recipe", id: "LIST" }],
    }),
  }),
});

export const { useGetPostsQuery, useGetRecipesQuery } = dummyJsonApi;

export default dummyJsonApi;
