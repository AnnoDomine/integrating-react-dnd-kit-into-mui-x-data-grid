import React from "react";
import type { PostsResponse } from "../../../redux/api/dummyJsonApi";
import type { DataGridProps, GridRowParams } from "@mui/x-data-grid";
import type { DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";

export type GridContextValues = {
  gridProps: DataGridProps<PostsResponse["posts"][number]>;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  draggedRow: GridRowParams<PostsResponse["posts"][number]> | null;
};

export const GridContext = React.createContext<GridContextValues | undefined>(
  undefined
);

export const useGridContext = () => {
  const context = React.useContext(GridContext);
  if (!context) {
    throw new Error("useGridContext must be used within a GridContextProvider");
  }
  return context;
};
