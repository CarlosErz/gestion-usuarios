import { UserMain } from "./page/UserMain"
import { RegisterEmployee } from "./page/RegisterEmploye"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserMain />} />
          <Route path="/register" element={<RegisterEmployee />} />
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
