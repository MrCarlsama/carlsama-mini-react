import { render } from "./React.js";

export const ReactDom = {
  createRoot(container) {
    return {
      render(App) {
        render(App, container);
      },
    };
  },
};
