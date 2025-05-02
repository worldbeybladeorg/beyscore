// Placeholder for the equivalent of useColorMode in Nuxt
import { Button } from "react-bootstrap";
import { useColorMode } from "~/useColorMode";

export default function ThemeSwitcher() {
  const colorMode = useColorMode();

  function changeTheme(selectedTheme: "light" | "dark" | "system") {
    colorMode.setPreference(selectedTheme);
  }

  return (
    <div>
      <div className="dropdown">
        <Button
          id="themeDropdown"
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Change Theme
        </Button>
        <ul className="dropdown-menu" aria-labelledby="themeDropdown">
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => changeTheme("system")}
            >
              Auto
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => changeTheme("light")}
            >
              Light
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => changeTheme("dark")}
            >
              Dark
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
