import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { Drivers } from "./components/Drivers";
import { Forecast } from "./components/Forecast";
import { Header } from "./components/Header";
import { Highlights } from "./components/Highlights";
import { Homepage } from "./components/Homepage";
// import { Sidebar } from "./components/Sidebar";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/dashboard"
        element={
          <div className="app">
            <Header />

            <div className="app__body">
              {/*<Sidebar />*/}

              <main className="app__body__content">
                <Highlights />

                <Drivers />

                <Forecast />
              </main>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
