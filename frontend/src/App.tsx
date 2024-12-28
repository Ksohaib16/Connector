import  "./styles/global.css"
import { BrowserRouter, Routes, Route  } from "react-router-dom"
import { MainWrapper } from "./components/wrapper/MainWrapper"
import { Signup } from "./pages/Signup"
import { Login } from "./pages/Login"
import { Home } from "./pages/Home"
import { ContentWrapper } from "./components/wrapper/ContentWrapper"

function App() {
  return(
    <BrowserRouter>
    <MainWrapper>
      <ContentWrapper>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
    </Routes>
    </ContentWrapper>
    </MainWrapper>
    </BrowserRouter>
  )
}

export default App
