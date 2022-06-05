import Home from './pages/Home/Home.jsx'
import "./App.css"
import { useState, createContext } from"react"
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const tema = createTheme({
  palette: {
    primary: {
      main: '#faf5ee',
    }
  },
});

export const ThemeContext = createContext(null)

function App() {
  const [theme, setTheme] = useState("light")
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    toggleTheme();
  };

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className="App" id={theme}>
        <ThemeProvider theme={tema}>
          <div className="Switch">
            <Switch onChange={handleChange}/>
            <p>dark mode</p>
          </div>
        </ThemeProvider>
        <Home/>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
