import { useDraggable, useDroppable } from "@dnd-kit/core";
import { GridRow, type GridRowProps } from "@mui/x-data-grid";
import DragCell from "../drag-cell/drag-cell";
import { styled } from "@mui/material";
import clsx from "clsx";
import { useEffect } from "react";

const RowContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "&.is-over": {
    backgroundColor: "rgba(25, 118, 210, 0.08)", // secondary.main with 8% opacity
  },
    "&.is-dragging": {
      opacity: 0.5,
      backgroundColor: theme.palette.grey[300],
      boxShadow: theme.shadows[4],
      borderWidth: "0px",
      outline: "0px",
    },
}));

const MuiGridRow = styled(GridRow)(({ theme }) => ({
    "&.is-dragging": {
      opacity: 0.5,
      backgroundColor: theme.palette.grey[300],
      boxShadow: theme.shadows[4],
      borderWidth: "0px",
      outline: "0px",
    },
}));

const Row = (props: GridRowProps) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: props.rowId || "",
    data: props, // Pass the entire row props as data
  });
  const { transform, ...rest } = useDraggable({
    id: props.rowId || "",
    data: props, // Pass the entire row props as data
  });

  useEffect(() => {
    if (isOver) {
      console.log("Row is over", props.rowId);
    }
  }, [isOver, props.rowId]);

  return (
    <RowContainer
      ref={setDroppableRef}
      className={clsx({
        "is-over": isOver,
        "is-dragging": rest.isDragging,
      })}
        style={{
          transform:
            transform
              ? `translateY(${transform?.y}px)`
              : undefined,
        }}
    >
      <DragCell transform={transform} {...rest} />
      <MuiGridRow
        className={clsx({"is-dragging": !isOver && rest.isDragging})}
        {...props}
      />
    </RowContainer>
  );
};

export default Row;
