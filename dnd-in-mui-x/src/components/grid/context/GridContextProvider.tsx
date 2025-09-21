import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  useGetPostsQuery,
  type PostsResponse,
} from "../../../redux/api/dummyJsonApi";
import { GridContext } from "./gridContext";
import {
  useGridApiRef,
  type DataGridProps,
  type GridColDef,
} from "@mui/x-data-grid";
import Row from "../../row/row";
import { useImmer } from "use-immer";
import {
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { GridPaginationModel, GridRowParams } from "@mui/x-data-grid";

export const GridContextProvider = ({ children }: PropsWithChildren) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const calculatedPagination = useMemo(
    () => ({
      limit: paginationModel.pageSize,
      skip: paginationModel.page * paginationModel.pageSize,
    }),
    [paginationModel]
  );

  const { data, isUninitialized, isLoading, isFetching } = useGetPostsQuery({
    ...calculatedPagination,
  });

  const [rowStateOnDragStart, setRowStateOnDragStart] = useState<
    PostsResponse["posts"] | null
  >(null);
  const [draggedRow, setDraggedRow] = useState<
    GridRowParams<PostsResponse["posts"][number]> | null
  >(null);

  const apiRef = useGridApiRef();

  const [rows, setRows] = useImmer(data?.posts || []);

  const columns = useMemo((): GridColDef<PostsResponse["posts"][number]>[] => {
    if (rows.length === 0) return [];
    return [
      {
        field: "drag",
        headerName: "",
        width: 50,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: () => null,
      },
      {
        field: "id",
        headerName: "ID",
        width: 70,
      },
      {
        field: "rowId",
        headerName: "Row ID",
        width: 100,
      },
      {
        field: "title",
        headerName: "Title",
        width: 300,
      },
      {
        field: "body",
        headerName: "Body",
        width: 600,
      },
      {
        field: "tags",
        headerName: "Tags",
        width: 200,
        renderCell: (params) => params.value.join(", "),
      },
      {
        field: "reactions",
        headerName: "Reactions",
        width: 100,
        renderCell: (params) => params.value.likes - params.value.dislikes,
      },
      { field: "views", headerName: "Views", width: 100 },
    ];
  }, [rows]);

  const gridProps = useMemo(
    (): DataGridProps<PostsResponse["posts"][number]> => ({
      apiRef,
      rows,
      columns,
      loading: isLoading || isFetching,
      paginationModel,
      onPaginationModelChange: setPaginationModel,
      paginationMode: "server",
      pageSizeOptions: [5, 10, 20, 50, 100],
      rowCount: data?.total || 0,
      getRowId: (row) => row.rowId || row.id,
      slots: {
        row: (params) => <Row {...params} />,
      },
      slotProps: {
        loadingOverlay: {
          variant: "linear-progress",
        },
      },
      getRowClassName: (params) => (params.id === -1 ? "placeholder-row" : ""),
    }),
    [apiRef, rows, columns, isLoading, isFetching, paginationModel, data?.total]
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      console.groupCollapsed("Drag start");
      console.log("Drag started", event);
      const row: GridRowParams<PostsResponse["posts"][number]> | undefined =
        apiRef?.current?.getRowParams(event.active.id);
      const rowElement = apiRef?.current?.getRowElement(event.active.id);
      if (!row) {
        setDraggedRow(null);
        console.log("No row found");
        console.groupEnd();
        return;
      }
      if (!rowElement) {
        setDraggedRow(null);
        console.log("No row element found");
        console.groupEnd();
        return;
      }
      setRows((draft) => {
        const draggedId = draft.find((r) => r.rowId === event.active.id);
        const row = apiRef?.current?.getRowParams(event.active.id);
        if (!draggedId || !row) return;
        setDraggedRow(row);
        setRowStateOnDragStart(draft);
        // Remove the dragged row from the rows
        // const index = draft.findIndex((r) => r.rowId === draggedId.rowId);
        // if (index !== -1) {
        //   draft.splice(index, 1);
        // }
      });
      console.log("Row being dragged", row);
      console.log("Row element being dragged", rowElement);
      console.groupEnd();
    },
    [apiRef, setRows]
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      console.groupCollapsed("Drag end");
      console.log("Drag ended", event);
      if (!event.over) {
        console.log("No over element");
        console.groupEnd();
        setDraggedRow(null);
        setRows(rowStateOnDragStart || []);
        return;
      }
      setRows((draft) => {
        const oldIndex = draft.findIndex(
          (row) => row.rowId === event.active.id
        );
        const newIndex = draft.findIndex((row) => row.rowId === event.over?.id);
        console.table({ oldIndex, newIndex });
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          console.log("Row moved", { oldIndex, newIndex });
          const [movedRow] = draft.splice(oldIndex, 1);
          console.log("Moved row", movedRow);
          draft
            .splice(newIndex, 0, movedRow);
          draft.forEach((row, index) => {
            row.initialIndex = index + 1;
          });
        }
      });
        setDraggedRow(null);
      console.groupEnd();
    },
    [rowStateOnDragStart, setRows]
  );

  const onDragMove = useCallback((event: DragMoveEvent) => {
    console.log("Drag move", event);
  }, []);

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      console.groupCollapsed("Drag over");
      console.log("Drag over", event);
      const currentRows = [...rows];
      if (!event.over) {
        console.log("No over element");
        console.groupEnd();
        return;
      }
      const oldIndex = draggedRow?.row.initialIndex ?? -1;
      const newIndex = apiRef?.current?.getRowParams(event.over.id).row.initialIndex ?? -1;
      console.table({
        oldIndex,
        newIndex,
        oldIsNew: oldIndex === newIndex,
        activeId: event.active.id,
        overId: event.over?.id,
      });
      setRows((draft) => {
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const [movedRow] = draft.splice(oldIndex, 1);
          draft.splice(newIndex, 0, movedRow);
        }
      });
      const movedRow =
        oldIndex !== -1 && newIndex !== -1 ? currentRows[oldIndex] : null;
      console.log("Current rows", currentRows);
      console.log("Rows state", rows);
      console.log("Drag move", event);
      console.log("Old index:", oldIndex);
      console.log("New index:", newIndex);
      console.log("Moved row:", movedRow);
      console.groupEnd();
    },
    []
  );

  useEffect(() => {
    if (isUninitialized || isLoading) return;
    setRows(data?.posts || []);
  }, [data, isLoading, isUninitialized, setRows]);

  return (
    <GridContext.Provider
      value={{
        gridProps,
        onDragStart,
        onDragEnd,
        draggedRow,
        onDragMove,
        onDragOver,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
