import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import StationPage from "./pages/StationPage";

function App() {
	return (
		<>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/station/:codeStation" element={<StationPage />} />
			</Routes>
		</>
	);
}

export default App;
