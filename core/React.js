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

function updateProps(dom, nextProps, prevProps) {
  const ignoreKey = ["children"];

  // 1. old 有， new 没有 --> 删除
  Object.keys(prevProps ?? {}).forEach((key) => {
    /**
     * 过滤无需处理
     */
    if (ignoreKey.includes(key)) return;

    if (!(key in nextProps)) {
      dom.removeAttribute(key);
    }
  });

  // 2. new 有, old 没有 --> 添加
  // 3. old 有， new 有  --> 修改

  Object.keys(nextProps ?? {}).forEach((key) => {
    /**
     * 过滤无需处理
     */
    if (ignoreKey.includes(key)) return;

    if (nextProps[key] !== prevProps?.[key]) {
      const isEventProps = key.startsWith("on");
      if (isEventProps) {
        const eventType = key.slice("on".length).toLocaleLowerCase();
        dom.removeEventListener(eventType, prevProps?.[key]);
        dom.addEventListener(eventType, nextProps[key]);
      } else {
        dom[key] = nextProps[key];
      }
    }
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(children, fiber);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const node = createDom(fiber.type);

    fiber.dom = node;
    // fiber.parent.dom.append(node);

    updateProps(fiber.dom, fiber.props);
  }

  const children = fiber.props.children;
  reconcileChildren(children, fiber);
}

let deletions = [];
function reconcileChildren(children, fiber) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;

    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: "placement",
      };

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    prevChild = newFiber;
  });
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

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

function commitDeletions(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    commitDeletions(fiber.child);
  } else {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }

    fiberParent.dom.removeChild(fiber.dom);
  }
}

// ## day 3

// #### 拆解

// 1. 通过步骤后置，将dom添加渲染统一放到最后，解决界面可能只渲染部份节点的问题
//   - 移除单个任务中的 append 逻辑
//   - 当所有任务构建结束后，在执行 统一渲染视图 逻辑
//   - 通过递归虚拟DOM 渲染
let wipRoot = null;
let nextWorkOfUnit = null;
let currentRoot = null;
function commitRoot() {
  deletions.forEach(commitDeletions);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const workLoop = (deadline) => {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

function update() {
  wipRoot = {
    props: currentRoot.props,
    dom: currentRoot.dom,
    alternate: currentRoot,
  };

  nextWorkOfUnit = wipRoot;
}
function render(el, container) {
  wipRoot = {
    props: {
      children: [el],
    },
    dom: container,
  };

  nextWorkOfUnit = wipRoot;
}

export const React = {
  update,
  createElement,
  render,
};
