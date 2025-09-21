import { useDraggable } from "@dnd-kit/core";
import { styled } from "@mui/material";

type Props = ReturnType<typeof useDraggable>;

const DragCellContainer = styled("div")({
  cursor: "grab",
  position: "relative",
  width: "0px",
  overflow: "visible",
  bottom: "0px",
  fontSize: "20px",
  left: "25px",
  height: "0px",
  userSelect: "none",
});

const DragCellIcon = styled("div")(() => ({
  transform: "translate(-50%, -50%)",
  width: "30px",
  height: "30px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}));

const DragCell = ({ setNodeRef, attributes, listeners, active, isDragging }: Props) => {
    if (active && !isDragging) {
        return <DragCellContainer />;
    }
  return (
    <DragCellContainer ref={setNodeRef} {...attributes} {...listeners}>
      <DragCellIcon>⋮⋮</DragCellIcon>
    </DragCellContainer>
  );
};

export default DragCell;
