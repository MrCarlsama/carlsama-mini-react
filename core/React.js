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
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
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

  rootWork = nextWorkOfUnit;
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

function createDom(type) {
  return type === TextType
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  const ignoreKey = ["children"];
  Object.keys(props).forEach((key) => {
    /**
     * 过滤无需处理
     */
    if (!ignoreKey.includes(key)) {
      dom[key] = props[key];
    }
  });
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const node = createDom(fiber.type);

      fiber.dom = node;
      // fiber.parent.dom.append(node);

      updateProps(fiber.dom, fiber.props);
    }
  }

  const children = isFunctionComponent
    ? [fiber.type(fiber.props)]
    : fiber.props.children;

  let prevChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }

    prevChild = newWork;
  });

  fiber.next = (deep = false) => {
    if (!deep && fiber.child) {
      return fiber.child;
    }
    if (fiber.sibling) {
      return fiber.sibling;
    }
    return fiber.parent?.sibling || fiber.parent?.next(true);
  };

  let next = fiber.next();
  return next;
}

// ## day 3

// #### 拆解

// 1. 通过步骤后置，将dom添加渲染统一放到最后，解决界面可能只渲染部份节点的问题
//   - 移除单个任务中的 append 逻辑
//   - 当所有任务构建结束后，在执行 统一渲染视图 逻辑
//   - 通过递归虚拟DOM 渲染

function commitRoot() {
  commitWork(rootWork.child);
  rootWork = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

let rootWork = null;
let nextWorkOfUnit = null;
const workLoop = (deadline) => {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && rootWork) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

export const React = {
  createElement,
  render,
};
