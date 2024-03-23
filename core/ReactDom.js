import { React } from "./React.js";

export const ReactDom = {
  createRoot(container) {
    return {
      render(App) {
        React.render(App, container);
      },
    };
  },
};
