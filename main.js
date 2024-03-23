/**
 * v1
 * 先写死 vdom 和 dom 渲染
 */

// const App = document.createElement("div");
// App.id = "app";
// const text = document.createTextNode("app");
// text.nodeValue = "app";
// App.append(text);
// document.querySelector("#root").append(App);

/**
 * v2
 * 动态 vdom 和  写死 dom 渲染
 */
// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
//       children,
//     },
//   };
// }

// function createTextNode(text) {
//   return {
//     type: "TEXT_ELEMENT",
//     props: {
//       nodeValue: text,
//       children: [],
//     },
//   };
// }

// const textEl = createTextNode("app");
// const app = createElement("div", { id: "app" });

// const App = document.createElement(app.type);
// App.id = app.props.id;
// const text = document.createTextNode("");
// text.nodeValue = textEl.props.nodeValue;
// App.append(text);
// document.querySelector("#root").append(App);

/**
 * v3
 * 动态 vdom 和 动态 dom渲染
 */

// const TextType = "TEXT_ELEMENT";
// function createTextNode(text) {
//   return {
//     type: TextType,
//     props: {
//       nodeValue: text,
//       children: [],
//     },
//   };
// }

// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
//       children: children.map((child) => {
//         return typeof child === "string" ? createTextNode(child) : child;
//       }),
//     },
//   };
// }

// function render(el, container) {
//   const node =
//     el.type === TextType
//       ? document.createTextNode("")
//       : document.createElement(el.type);

//   const ignoreKey = ["children"];
//   Object.keys(el.props).forEach((key) => {
//     /**
//      * 过滤无需处理
//      */
//     if (!ignoreKey.includes(key)) {
//       node[key] = el.props[key];
//     }
//   });

//   el.props.children.forEach((child) => {
//     render(child, node);
//   });

//   container.append(node);
// }

// const App = createElement("div", { id: "app" }, "Carl");
// render(App, document.querySelector("#root"));

/**
 * v4 模仿 react 的 api
 */

// const ReactDom = {
//   createRoot(container) {
//     return {
//       render(App) {
//         render(App, container);
//       },
//     };
//   },
// };

import { App } from "./App.js";
import { ReactDom } from "./core/ReactDom.js";
ReactDom.createRoot(document.querySelector("#root")).render(App);
