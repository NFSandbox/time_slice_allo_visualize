---
marp: true
# theme: gaia
# _class: lead
paginate: true
headingDivider: true
backgroundColor: #fff
# backgroundImage: url('https://marp.app/assets/hero-background.svg')
footer: "
Time Slice Scheduling Algorithm Visualizer
"
---

<!-- _footer: ""-->
<!-- _paginate: skip -->

# Time Slice Schedule Algorithm **Visualizer**

Yujia, AHU - Software Engineering

![bg right:50% 60%](./assets/github_presentation_qrcode.png)

---


# Goals

##### Implement three basic **Scheduling Algorithm** within `JavaScript`

- Priority Scheduling
- Short Job First
- Multilevel Feedback Queue

##### Algorithm Process **Visualization** using `Web Frontend` Technology

- Data structure visualization
- Proper animation design

---

# Separation: Conceptions

Uncoupled Algorithm and Visualization part.

![fg](./assets/Visualization%20Process.png)

`Algorithm` and `Visualization` communicate based on **shared data structure definitions & interfaces**.

---

# Separation: Data Interfaces

```typescript
export interface SimulatorSnapshot {
  timestamp: number;
  pcbList: ProcessControlBlock[];   // <-- List of ProcessControlBlock instance
  nextAllocation?: ProcessControlBlock;
  ...;
}
```

```typescript
class ProcessControlBlock {
    pId: string;
    requiredTime: number;
    arrivalTime: number;
    ...;
}
```

> Check out `/src/algorithm/schemes.tsx` for more info about 
> shared **typed interfaces**, powered by `TypeScript`.

---

# Algorithm Implementation

- Comply with OOP 
  _(Object-Oriented Programming)_ conceptions.
- All `Simulator` classes are derived from `SimulatorBase`.

![bg right:50% 90%](./assets/Simulator%20Structure.png)

---

# Visualization

<!-- _paginate: skip -->

Using **modern Web technology** to achieve **simple, intuitive visualization**.

---

# Visualization

### General Info

- Current timestamp
- Next planned allocation
- Detailed processes info

### Algorithm-Related Info

- Processing Sequence List (for `PS` & `SJF`)
- Feedback Queues (for `MFQ`)

---

# Visualization

## **Realtime Simulator States** *Dynamic* Visualization

- Directly controls the `Simulator` in step-wise, showing **real-time fresh states 
  of the simulator**.
- **High-efficiency**. HOWEVER, need algorithm support for **step backward**.

## **Frame-Based** *Static* Visualization (SELECTED)

- Finish the simulation first, **record and store each frames** while processing.
- Higher **Space Complexity**, but much more easier to support step forward/backward operations.

---

# **Frame-Based** Simulation & Visualization

![bg right:60% fit 90%](./assets/Frame%20Based%20Visualization.png)

---

# Visualization

##### Unified **Page Template**

All visualization pages shared identical layout template, which contains:

```tsx
<PageTemplate
  algorithmName="..."
  snapshotList={SimulatorSnapshot[]}
  visualizer={function (snapshot: SimulatorSnapshot){
    return React.ReactNode;
  }}
  ...
/>
```

> Check out `/src/app/simulate/template.tsx` for more info.

---

# Visualization **Highlight**

- **Smooth and high-quality animations**, powered by `LayoutAnimation` and `AnimatePresence` in `framer-motion`.
- **Hotkey Control** support.
- Full **Dark Mode** support.


Check out the Live Demo.

##### Dive Deeper On **Layout Animation**

- Layout Effect In Framer Motion: https://blog.maximeheckel.com/posts/framer-motion-layout-animations/

---

# Refs: Used Framework & Packages

##### Language

- ![](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white) Used as major dev language, support type checking / linting.

##### Framework

- ![](https://img.shields.io/badge/React-333333?style=for-the-badge&logo=react&logoColor=white) Basic declarative Web frontend framework.
- ![](https://img.shields.io/badge/Next.JS-111111?style=for-the-badge&logo=next.js&logoColor=white) Enhance and unify dev experience with React, providing file-base router, loading optimization etc.

##### UI/UX

- ![](https://img.shields.io/badge/Ant_Design-00a5d7?style=for-the-badge&logo=antdesign&logoColor=white) Popular web frontend component library, open-sourced by Ali.
- ![](https://img.shields.io/badge/Framer_Motion-9700ff?style=for-the-badge&logo=framer&logoColor=white) Add simple and intuitive animation for visualization.

<br>

----

# Refs: Used Framework & Packages

- React: https://react.dev/
- Next.js: https://nextjs.org/
- Ant Design: https://ant.design/
- Framer Motion: https://www.framer.com/motion/

---

# Refs: More

- **Marp Markdown Presentation EcoSystem** (https://marp.app/) for generating this presentation.
- **Badges Shields** (https://github.com/badges/shields) for generating beautiful badges used in this presentation.

---

# **Thanks** For Listening

<!-- _paginate: skip -->
<!-- _footer: "All codes inside this repository `/src` directory are 100% original. 
Used packages & dependencies are listed in `/package.json`" -->

![fg w:20](./assets/github.svg) Github Repo: https://github.com/NFSandbox/time_slice_allo_visualize

