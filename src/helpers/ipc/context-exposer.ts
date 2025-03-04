import { exposeAutoUpdateContext } from "./autoupdates/autoupdates-context";
import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  exposeAutoUpdateContext();
}
