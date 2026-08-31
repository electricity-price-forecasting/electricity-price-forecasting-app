import "./App.scss";
import { Drivers } from "./components/Drivers";
import { Forecast } from "./components/Forecast";
import { Header } from "./components/Header";
import { Highlights } from "./components/Highlights";
// import { Sidebar } from "./components/Sidebar";

export const App = () => {
  return (
    <>
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
    </>
  );
};
