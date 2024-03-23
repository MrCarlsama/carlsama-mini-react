const TextType = "TEXT_ELEMENT";
export function createTextNode(text) {
  return {
    type: TextType,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}

export function render(el, container) {
  const node =
    el.type === TextType
      ? document.createTextNode("")
      : document.createElement(el.type);

  const ignoreKey = ["children"];
  Object.keys(el.props).forEach((key) => {
    /**
     * 过滤无需处理
     */
    if (!ignoreKey.includes(key)) {
      node[key] = el.props[key];
    }
  });

  el.props.children.forEach((child) => {
    render(child, node);
  });

  container.append(node);
}
