# 项目名称

Carlsama mini-react

## day 1

### 第一节

拆解
1. 先写死 vdom 和 dom 渲染
2. 写活 vdom 和 写死 dom渲染
3. 动态 vdom 和 dom 渲染
4. 模仿 React API
5. 目录结构拆解



### 第二节
#### 拆解
1. 创建 vite 原生 js 项目，使其可以加载 jsx
2. 改造文件 main.js App.js
3. 从 createElement 写法 改成 JSX 语法

#### 思考题

**Q：当 DOM 树非常庞大的话，执行 render 函数会出现什么情况？**  

A：首先由于疯狂调用浏览器API createElement 会创建许多新的 DOM 对象，这会消耗一定的内存，当 DOM 树特别庞大的时候，大量内存可能导致浏览器变卡或者崩溃。且由于浏览器需要花费时间渲染新创建的 DOM 元素，会花费大量时间渲染，也会让浏览器变卡。也是为什么React或者Vue都选择虚拟DOM的原因之一。


### 第三节
#### 拆解
1. 新增 vitest
2. 对 createElement 进行单元测试
3. expect(el).toMatchInlineSnapshot 快速生成快照


## day 2

#### 拆解

1. 通过 requestIdleCallback 利用空闲时间渲染 dom

2. 简易 fiber 架构
  - 构建成树结构，然后依次顺序查找
  - 先找 子节点
  - 其次找 兄弟节点
  - 最后找 叔叔节点

3. 构建“边渲染边找”函数
  - 创建 dom 和 更新 props
  - 初始化子节点
  - 返回下一个执行任务


## day 3

### 第一节

#### 拆解

1. 通过步骤后置，将dom添加渲染统一放到最后，解决界面可能只渲染部份节点的问题
  - 移除单个任务中的 append 逻辑
  - 当所有任务构建结束后，在执行 统一渲染视图 逻辑
  - 通过递归虚拟DOM 渲染

### 第二节

#### 拆解
1. 实现 Function Component
2. 区别type 是否为函数，如果是，需要执行函数获取结果


## day 4

### 第一节

#### 拆解

1. 实现事件机制，通过 props 判断 on 开头的属性

### 第二节

#### 拆解

1. 实现 更新 Props
2. 创建新旧 vdom 树，新的指向旧的
3. 对比 props

## day 5

### 第一节

#### 拆解

1. 实现更新 children
2. 当 type 不一致时，需要删除旧的 dom 树
3. 收集需要被删除的 dom 树。在统计提交时候进行移除


### 第二节

#### 拆解
1. 更新删除多余兄弟节点


### 第三节

#### 拆解

1. 判断 “false ” 节点，需要进行跳过处理