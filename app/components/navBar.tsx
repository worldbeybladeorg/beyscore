import ThemeSwitcher from "./themeSwitcher";

export default function NavBar() {
  return (
    <header>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            BeyScore
          </a>
          <ThemeSwitcher />
        </div>
      </nav>
    </header>
  );
}
