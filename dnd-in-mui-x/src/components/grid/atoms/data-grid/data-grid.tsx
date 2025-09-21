import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useGridContext } from "../../context/gridContext";

const Container = () => {
  const { gridProps, draggedRow } = useGridContext();
  return (
    <div
      style={{ height: "100%", width: 1200, position: "relative", zIndex: 1 }}
    >
      <div
        style={{
          height: "70px",
          width: "auto",
          background: "white",
          marginBottom: "10px",
          position: "relative",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          color: "black",
          padding: "10px",
        }}
      >
        Ele: {draggedRow?.row.rowId && draggedRow.row.rowId}
      </div>
      <div style={{ height: "500px", width: "100%" }}>
        <MuiDataGrid {...gridProps} />
      </div>
      <DragOverlay>
        {draggedRow && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px dashed gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {draggedRow.row.title}
          </div>
        )}
      </DragOverlay>
    </div>
  );
};

const DataGrid = () => {
  const { onDragStart, onDragEnd, onDragMove, onDragOver } = useGridContext();
  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
      onDragOver={onDragOver}
    >
      <Container />
    </DndContext>
  );
};

export default DataGrid;
