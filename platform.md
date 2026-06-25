# Smart Programmer — Platform Architecture

> **Project name:** Smart Programmer  
> **Scope:** Complete DSA visualizer platform — Loop Foundations, Array, String,
> LinkedList, Stack/Queue, Tree, Graph, Recursion, Dynamic Programming  
> Module 0 (Loop Foundations) and Module 1 (Array Mastery) are the first two
> build targets. This document is the platform-level map; module-specific specs
> (`spec.md`, `engine.md`, `patterns.md`) sit below it.

---

## 1. The principle that makes this scalable

Every algorithm = a precomputed `steps[]` array of snapshots. The UI just plays
back snapshots — it never re-runs algorithm logic live.

This principle is **data-structure agnostic.** A `Step` for a linked list looks
different from a `Step` for an array, but the *playback machinery* (Play/Pause/Step/Scrub,
CodePanel sync, VariableWatchPanel) is identical.

**What changes per module:** only the *renderer* (how the data structure is drawn)
and the *shape of the snapshot* (what fields a step needs). Everything else —
controls, code sync, input handling pattern — is shared platform-wide.

---

## 2. Module list and build order

```
0. Loop Foundations   ← 109 programs, 8 levels (build FIRST — most beginner-level)
1. Array
2. String
3. Stack
4. Queue
5. Recursion
6. Linked List
7. Tree
8. Graph
9. Dynamic Programming
```

**Why Module 0 before Array:** Loop Foundations covers single-number and counter
programs taught before arrays in typical curricula (matches Lerniz Day 1–9 practice
sheets). Array remains the first *data-structure* module; Module 0 is the
pre-array foundation.

| Module | New renderer needed | New movement types | Reuses from prior modules |
|---|---|---|---|
| **0. Loop Foundations** | `CounterCanvas`, `OutputBuilderCanvas` (+ digit/GCD/sequence visuals for Q/R/S) | **Q–T** (see §3) | Type A from Array catalogue for Levels 1–2 |
| **1. Array** | `ArrayCanvas` | A–I | — (base data-structure module) |
| **2. String** | Same `ArrayCanvas` (chars instead of numbers) | None new | Almost everything from Array |
| **3. Stack** | `StackCanvas` | **J — LIFO push/pop** | PlaybackControls, CodePanel, VariableWatchPanel |
| **4. Queue** | `QueueCanvas` | **K — FIFO push/pop**, circular wraparound | Same as above |
| **5. Recursion** | `CallStackCanvas` (Type I generalized) | Type I already covers this | Step engine, controls |
| **6. Linked List** | `LinkedListCanvas` | **L — pointer rewiring** | Step engine, controls |
| **7. Tree** | `TreeCanvas` | **M — tree traversal** | Step engine, controls, CallStackCanvas (DFS), QueueCanvas (BFS) |
| **8. Graph** | `GraphCanvas` | **N — frontier expansion**, **O — DFS with backtrack** | Step engine, controls, Stack/Queue |
| **9. Dynamic Programming** | `DPTableCanvas` | **P — table fill from dependencies** | Step engine, controls, Kadane-style dependency highlighting |

**Renderer count:** Module 0 adds 2 new renderers (`CounterCanvas`, `OutputBuilderCanvas`).
String and Recursion require zero new renderers. Total new renderer work across the
platform: **8** (Counter, OutputBuilder, Array, Stack, Queue, LinkedList, Tree, Graph, DP).

---

## 3. Movement type catalogue

### Types A–I (Array module — see `engine.md`)

Defined in the Array engine spec. Type A (single pass) is **reused directly** in
Module 0 Levels 1–2.

### Type J — Stack (LIFO)

Vertical column; push slides in from top, pop removes top. Show "top" pointer.

### Type K — Queue (FIFO)

Horizontal row; enqueue from right, dequeue from left. Circular queue uses ring layout.

### Type L — Pointer Rewiring (Linked List)

Nodes + arrows; traversal follows `next`; reversal shows arrows flipping direction
with `prev`/`curr`/`next` labeled.

### Type M — Tree Traversal

Node-link tree; visit-order badges; pair DFS with `CallStackCanvas`, BFS with `QueueCanvas`.

### Type N — Frontier Expansion (BFS on Graph)

Nodes colored by distance ring; one full ring per step; `QueueCanvas` beside graph.

### Type O — Depth-First with Backtrack (DFS on Graph)

Path deepens then retreats on dead ends; pair with `CallStackCanvas`.

### Type P — Table Fill from Dependencies (DP)

1D/2D grid; highlight dependency cells before filling current cell.

### Type Q — Digit Extraction (Module 0)

**Code shape:**
```python
while num > 0:
    digit = num % 10
    process(digit)
    num = num // 10
```

**Visual:** Number as digit-boxes; rightmost digit detaches into an "extracted" tray;
remaining number shrinks. Watch panel tracks `num` and `digit`.

**Used in:** Programs 21–37 (digit manipulation), 49–50 (prime factorization — similar
peeling with divisor instead of `%10`).

### Type R — Euclidean Substitution (Module 0)

**Code shape:**
```python
while b != 0:
    a, b = b, a % b
```

**Visual:** Two number boxes side by side; modulo shown each step; pair shrinks toward
final GCD.

**Used in:** Programs 51–53 (GCD, LCM, co-prime check).

### Type S — Accumulating Sequence (Module 0)

**Code shape:**
```python
terms = [first values...]
for i in range(n):
    next_term = combine(terms[-1], terms[-2], ...)
    terms.append(next_term)
```

**Visual:** Growing horizontal list; highlight contributing prior terms with
connecting arrows before appending new box (same idea as Kadane dependency highlighting).

**Used in:** Programs 59–71 (Fibonacci, Tribonacci, AP, GP, series sums).

### Type T — Nested Loop Output Builder (Module 0)

**Code shape:**
```python
for row in range(1, n+1):
    for col in range(1, row+1):
        print(value, end=' ')
    print()
```

**Visual — split view:**
- **Left:** CodePanel with **outer and inner loop lines highlighted in different colors**
- **Right:** `OutputBuilderCanvas` — console output building char-by-char, line-by-line
- **Watch panel:** `row`, `col` tracker on every inner-loop iteration
- **Step granularity:** one step = one character/number printed (including newline)

**Used in:** Programs 72–109 (all 38 pattern-printing programs).

---

## 4. Module 0 — Loop Foundations (summary)

**Source:** "04_Loops - Practice programs (I & II)" — 109 programs, 8 levels.

**Why separate from Array:** Every program operates on a single number or counter,
not an array. No "boxes in a row" — instead counter values changing, digits peeling,
or output building line by line.

### Levels overview

| Level | Programs | Movement type | Renderer |
|---|---|---|---|
| 1 — Counting & Printing | 1–9 | A | `CounterCanvas` |
| 2 — Summation & Calculation | 10–22 | A (+ accumulator) | `CounterCanvas` |
| 3 — Digit Manipulation | 23–37 | Q | Digit extraction visual (Type Q) |
| 4 — Prime & Factors | 38–50 | A (+ inner divisor loop) | `CounterCanvas` + inner-loop visual |
| 5 — GCD/LCM | 51–58 | R (+ A/Q reuse) | Type R GCD visual |
| 6 — Series & Sequences | 59–71 | S (+ A) | Type S sequence visual |
| 7 — Pattern Printing: Numbers | 72–88 | T | `OutputBuilderCanvas` |
| 8 — Pattern Printing: Stars | 89–109 | T | `OutputBuilderCanvas` (same engine) |

### Module 0 build priority

1. **Renderers first:** `CounterCanvas` (L1–2), Type Q digit visual (L3), Type R GCD
   visual (L5), **`OutputBuilderCanvas` for Type T (L7–8 — highest priority, 38/109 programs)**
2. **Pattern foundations (L7–8):** Build 4–5 core patterns fully (right triangle,
   inverted triangle, centered pyramid, hollow square, diamond) — remaining 33 patterns
   are print-condition swaps only
3. **Levels 1–2 first** as warm-up (pure Type A reuse)
4. **Levels 4–6** after L7–8 renderer is solid (reuse A/Q/R/S, no new UI)

Full program list with per-program visualization notes: see Module 0 spec document.

---

## 5. Folder structure (platform-wide)

```
/src
  /engine
    StepEngine.ts              # shared Step type + buildStepsFn signature
  /components
    /shared
      CodePanel.tsx            # dual-loop highlight mode for Type T
      VariableWatchPanel.tsx
      PlaybackControls.tsx
      InputPanel.tsx
    /renderers
      CounterCanvas.tsx        # Module 0 — Levels 1-2, parts of 4-6
      OutputBuilderCanvas.tsx  # Module 0 — Levels 7-8 (Type T)
      DigitCanvas.tsx          # Module 0 — Type Q digit extraction
      SequenceCanvas.tsx       # Module 0 — Type S accumulating sequence
      GcdCanvas.tsx            # Module 0 — Type R Euclidean pair
      ArrayCanvas.tsx          # Modules 1-2 (Array + String)
      StackCanvas.tsx
      QueueCanvas.tsx
      LinkedListCanvas.tsx
      TreeCanvas.tsx
      GraphCanvas.tsx
      CallStackCanvas.tsx
      DPTableCanvas.tsx
  /modules
    /loops
      /problems                # Module 0 — 109 programs
    /array
      /problems
    /string
      /problems
    /stack
      /problems
    /queue
      /problems
    /linkedlist
      /problems
    /recursion
      /problems
    /tree
      /problems
    /graph
      /problems
    /dp
      /problems
  /pages
    ProblemPage.tsx            # ONE generic page — picks renderer via config.dataStructure
  /data
    modulesIndex.ts            # all modules + problem configs, drives navigation
```

---

## 6. ProblemConfig (platform-wide)

```ts
type ModuleId =
  | 'loops'
  | 'array'
  | 'string'
  | 'stack'
  | 'queue'
  | 'linkedlist'
  | 'recursion'
  | 'tree'
  | 'graph'
  | 'dp';

type DataStructure =
  | 'counter'        // Module 0 — CounterCanvas
  | 'outputbuilder'  // Module 0 — OutputBuilderCanvas (Type T)
  | 'digit'          // Module 0 — Type Q
  | 'sequence'       // Module 0 — Type S
  | 'gcd'            // Module 0 — Type R
  | 'array'
  | 'stack'
  | 'queue'
  | 'linkedlist'
  | 'tree'
  | 'graph'
  | 'callstack'
  | 'dptable';

type ProblemConfig = {
  id: string;
  title: string;
  module: ModuleId;
  dataStructure: DataStructure;
  movementType: string;  // 'A'–'T' (and future extensions)
  codeLines: string[];
  defaultInput: unknown;
  buildSteps: (input: unknown) => Step[];
};
```

`ProblemPage` mounts the renderer from `dataStructure` — the one branch point in
the whole platform. `CodePanel` gains a **dual-highlight mode** when
`movementType === 'T'` (outer loop vs inner loop in different colors).

---

## 7. Cursor build directives

1. Name the project/repo **`smart-programmer`**, not `array-mastery-visualizer`.
2. Build `/engine` and `/components/shared` with **platform-wide naming** from day one.
3. Structure `ProblemConfig` with `module` and `dataStructure` from the start — populate
   `'loops'` first, then `'array'`.
4. **Build order:** Module 0 (Loop Foundations) → Module 1 (Array) → remaining modules
   per §2.
5. Module 0: ship renderers + foundational patterns before attempting all 109 programs.
   Module 1: ship completely per `spec.md` before Module 2.

---

## 8. Related documents

| Document | Scope |
|---|---|
| `platform.md` (this file) | Platform map, modules, renderers, movement types |
| Module 0 spec | Full 109-program list with visualization notes |
| `spec.md` | Array module detailed problem list |
| `engine.md` | Step-engine rules, Types A–I detail |
| `patterns.md` | Why-reasoning framework for Array patterns |
