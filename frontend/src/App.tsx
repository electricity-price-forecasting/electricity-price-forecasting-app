import "./App.scss";
import logo from "./assets/logo.svg";
import fileIcon from "./assets/file-button.svg";
import headphonesIcon from "./assets/headphones-button.svg";
import searchIcon from "./assets/search-icon.svg";

function App() {
  return (
    <header className="header">
      <a href="" className="header__logo">
        <img className="header__logo__img" src={logo} alt="" />
      </a>

      <div className="header__buttonBox">
        <div className="header__buttonBox__search">
          <img
            src={searchIcon}
            alt=""
            className="header__buttonBox__search__icon"
          />
          <input
            type="text"
            placeholder="Search..."
            className="header__buttonBox__search__searchField"
          />
        </div>

        <a href="" className="header__buttonBox__button">
          <img
            src={fileIcon}
            alt=""
            className="header__buttonBox__button__img"
          />
        </a>
        <a href="" className="header__buttonBox__button">
          <img
            src={headphonesIcon}
            alt=""
            className="header__buttonBox__button__img"
          />
        </a>
      </div>
    </header>
  );
}

export default App;
