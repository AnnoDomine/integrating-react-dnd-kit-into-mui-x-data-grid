import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import Grid from './components/grid/Grid'
import { createTheme, ThemeProvider } from '@mui/material'

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Grid />
      </Provider>
    </ThemeProvider>
  )
}

export default App
