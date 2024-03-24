const TextType = "TEXT_ELEMENT";
function createTextNode(text) {
  return {
    type: TextType,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
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

function render(el, container) {
  nextWorkOfUnit = {
    props: {
      children: [el],
    },
    dom: container,
  };
}

// 2. 简易 fiber 架构
//   - 构建成树结构，然后依次顺序查找
//   - 先找 子节点
//   - 其次找 兄弟节点
//   - 最后找 叔叔节点

// 3. 构建“边渲染边找”函数
//   - 创建 dom 和 更新 props
//   - 初始化子节点
//   - 返回下一个执行任务

function performWorkOfUnit(work) {
  if (!work.dom) {
    const node =
      work.type === TextType
        ? document.createTextNode("")
        : document.createElement(work.type);

    work.dom = node;
    console.log(work);
    work.parent.dom.append(node);

    const ignoreKey = ["children"];
    Object.keys(work.props).forEach((key) => {
      /**
       * 过滤无需处理
       */
      if (!ignoreKey.includes(key)) {
        node[key] = work.props[key];
      }
    });
  }

  let prevChild = null;
  work.props.children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      work.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }

    prevChild = newWork;
  });

  if (work.child) return work.child;
  if (work.sibling) return work.sibling;

  return work.parent?.sibling;
}

let nextWorkOfUnit = null;
const workLoop = (deadline) => {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

export const React = {
  createElement,
  render,
};
