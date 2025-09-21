import DataGrid from "./atoms/data-grid/data-grid"
import { GridContextProvider } from "./context/GridContextProvider"

    

const Grid = () => {
  return (
        <GridContextProvider>
            <DataGrid />
        </GridContextProvider>
  )
}

export default Grid