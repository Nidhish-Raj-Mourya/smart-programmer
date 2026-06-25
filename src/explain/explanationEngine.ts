import type { MovementType, ProblemApproach, ProblemConfig } from '../engine/types';
import { getAlgorithmForId } from './algorithmCatalog';

type Template = {
  problem: (title: string) => string;
  approach: (title: string) => string[];
  solution: (title: string) => string;
  tip?: string;
};

const VAR_HINTS: Record<string, string> = {
  arr: 'arr — input array (comma-separated)',
  arr2: 'arr2 — second array (merge/copy problems)',
  n: 'n — count / size',
  x: 'x — target value (search/compare)',
  k: 'k — window size / kth element / rotations',
  pos: 'pos — index position',
  val: 'val — value to insert/replace',
  i: 'i — loop index',
  j: 'j — second index / inner loop',
  total: 'total — running sum (accumulator)',
  count: 'count — counter variable',
  target: 'target — goal sum/value',
  a: 'a — first number (GCD etc.)',
  b: 'b — second number',
  num: 'num — single number input',
};

function vars(keys: string[]): string[] {
  return keys.map((k) => VAR_HINTS[k] ?? `${k} — input parameter`);
}

const MOVEMENT: Partial<Record<MovementType, Template>> = {
  A: {
    problem: (t) => `${t} — ek simple loop se array ya number par kaam karna hai. Har step par ek element process hota hai.`,
    approach: () => [
      'Input read karo (array ya numbers).',
      'Result ke liye variable banao (sum, count, max…).',
      'Loop chalao — har index/element par condition check karo.',
      'Result update karo aur end mein print/return karo.',
    ],
    solution: () =>
      'Loop body mein sirf ek chhota kaam repeat hota hai. Debugger mein highlighted line = ab yeh statement execute ho rahi hai. Watch panel mein variables live change hote hain — jaise real IDE debugger.',
    tip: 'Pehle Step dabao, phir Play — har iteration samajh aayegi.',
  },
  B: {
    problem: (t) => `${t} — do pointers (left/right ya slow/fast) ek saath move karte hain. Array ko index se dono taraf se scan karte hain.`,
    approach: () => [
      'Do pointers set karo (left/right ya slow/fast).',
      'Condition ke hisaab se pointer move karo ya swap karo.',
      'Pointers cross/m meet hone tak repeat karo.',
    ],
    solution: () =>
      'Visualization mein do labels (left, right…) dikhenge. Swap steps par dono cells yellow highlight hongi. Two-pointer se O(n) mein kaafi problems solve hoti hain bina extra array ke.',
    tip: 'Sorted array par two-pointer bahut powerful hai — pair sum jaisi problems.',
  },
  C: {
    problem: (t) => `${t} — sliding window: ek fixed ya variable size ka subarray slide karta hai.`,
    approach: () => [
      'Window [start…end] define karo.',
      'Expand: end aage badhao jab condition allow kare.',
      'Shrink: start aage badhao jab condition toot jaye.',
      'Har valid window par answer update karo.',
    ],
    solution: () =>
      'Window range array par highlight dikhegi. Fixed window mein size K constant rehta hai; variable window expand/shrink hoti hai. Max/min sum yahi pattern se nikalte hain.',
    tip: 'Window sum update: naya element add, purana remove — poora dubara sum mat karo.',
  },
  D: {
    problem: (t) => `${t} — sorted data par binary search: har step par range aadha hota hai.`,
    approach: () => [
      'lo = 0, hi = n-1 set karo.',
      'mid = (lo+hi)//2 nikalo.',
      'arr[mid] vs target compare — left ya right half chhodo.',
      'lo <= hi tak repeat.',
    ],
    solution: () =>
      'Search range [lo…hi] highlight hogi. Har step par sirf ek half bachta hai — O(log n). Miss par bhi insert position boundary se milti hai.',
    tip: 'Duplicates ke liye match milne par bhi ek taraf search jari rakho (first/last occurrence).',
  },
  E: {
    problem: (t) => `${t} — cyclic sort / index-as-hash: element ko uski sahi index par rakho.`,
    approach: () => [
      'Har index par check: kya arr[i] sahi jagah par hai?',
      'Galat ho to sahi index par swap karo.',
      'Repeat jab tak sorted placement na ho.',
    ],
    solution: () =>
      'Missing/duplicate problems mein element ko uski expected index par bhejna hota hai. Swap animation se placement clear dikhega.',
    tip: 'Range 1…n ho to index = value-1 useful trick hai.',
  },
  F: {
    problem: (t) => `${t} — hash map / seen set se O(1) lookup — frequency ya duplicate track karo.`,
    approach: () => [
      'Empty hashmap ya set banao.',
      'Har element par: pehle dekho seen mein hai ya nahi.',
      'Count update karo ya duplicate flag set karo.',
    ],
    solution: () =>
      'Side panel mein Frequency map / Seen set live build hota hai. Linear scan + hash = O(n) time.',
    tip: 'Key = element value, Value = count — frequency problems ke liye.',
  },
  G: {
    problem: (t) => `${t} — running accumulator (Kadane style): extend ya reset decision har step par.`,
    approach: () => [
      'currentBest aur globalBest variables rakho.',
      'Har element par: extend karo ya naya start (reset).',
      'globalBest update karte jao.',
    ],
    solution: () =>
      'Negative sum aane par reset animation dikhega — max subarray yahi idea hai. Product subarray mein min bhi track karna padta hai (sign flip).',
    tip: 'Kadane = "ab tak ka best" vs "yahan se naya start" — message box padho.',
  },
  U: {
    problem: (t) => `${t} — two-pass: pehla pass prefix/left info, doosra pass suffix/right — phir combine.`,
    approach: () => [
      'Pass 1: left se right prefix array banao.',
      'Pass 2: right se left suffix array banao.',
      'Dono combine karke final answer nikalo.',
    ],
    solution: () =>
      'Pass 1 poora complete hone ke baad Pass 2 start hota hai — interleave nahi. Product except self aur trapping rain yahi pattern use karte hain.',
    tip: 'Extra O(n) space — beginner friendly; optimal one-pass advanced hai.',
  },
  V: {
    problem: (t) => `${t} — Boyer-Moore voting: candidate + count se majority element dhundo.`,
    approach: () => [
      'candidate = arr[0], count = 1.',
      'Har element: same ho to count++, different ho to count--.',
      'count 0 ho to naya candidate = current element.',
    ],
    solution: () =>
      'Candidate box aur count meter side mein dikhenge — tug-of-war jaisa. Final candidate verify karna mat bhoolna agar majority guaranteed nahi.',
    tip: 'O(n) time, O(1) space — interview favourite.',
  },
  W: {
    problem: (t) => `${t} — divide & conquer: array todho, halves solve karo, merge par combine.`,
    approach: () => [
      'Base: size 1 → return.',
      'Split array in half.',
      'Recursively left + right solve.',
      'Merge step par cross pairs count/combine.',
    ],
    solution: () =>
      'Split animation array ko do hisson mein dikhata hai. Merge step par cross elements highlight hote hain — inversions yahi count hote hain.',
    tip: 'Merge sort ka combine step samjho — inversions wahi count hote hain.',
  },
  X: {
    problem: (t) => `${t} — next/previous permutation: pivot dhundo, swap, suffix reverse.`,
    approach: () => [
      'Right se scan — pivot jahan arr[i] < arr[i+1].',
      'Pivot ke right mein successor dhundo (just bigger).',
      'Swap pivot aur successor.',
      'Suffix reverse karo.',
    ],
    solution: () =>
      'Teen phase alag steps mein dikhengi: pivot highlight → swap → suffix reverse. Lexicographic order samajhne ka best visual.',
    tip: 'Agar pivot nahi mila — array already largest permutation hai.',
  },
  Q: {
    problem: (t) => `${t} — digit extraction: num % 10 se rightmost digit, num // 10 se shrink.`,
    approach: () => [
      'while num > 0 loop.',
      'digit = num % 10',
      'digit par process (sum/count/reverse build).',
      'num = num // 10',
    ],
    solution: () =>
      'Rightmost digit box alag tray mein jata hai — number visually chhota hota hai. Watch mein num aur digit dono dikhte hain.',
    tip: '% 10 = last digit, // 10 = baaki number.',
  },
  R: {
    problem: (t) => `${t} — Euclidean GCD: b != 0 tak a,b = b, a%b.`,
    approach: () => ['a, b input lo.', 'while b != 0: remainder = a % b, phir a,b update.', 'a = GCD'],
    solution: () => 'Do boxes side by side shrink hote hain jab tak ek zero na ho. LCM = (a×b)/GCD.',
    tip: 'Recursive version bhi same logic — base case b == 0.',
  },
  S: {
    problem: (t) => `${t} — sequence build: naya term pichhle 1-2 terms se banta hai.`,
    approach: () => [
      'Pehle 1-2 terms seed karo.',
      'Loop: next = combine(previous terms).',
      'Sequence mein append karo.',
    ],
    solution: () =>
      'Naye box se pehle contributing purane boxes par arrows dikhenge — Fibonacci/Tribonacci clear ho jata hai.',
    tip: 'Fibonacci: next = prev + prev2.',
  },
  T: {
    problem: (t) => `${t} — nested loops: outer row, inner col — output line-by-line print hota hai.`,
    approach: () => [
      'for row in range… (outer loop).',
      'for col in range… (inner loop).',
      'Har inner step par ek character/number print.',
      'Row khatam → newline.',
    ],
    solution: () =>
      'Code mein outer (yellow) aur inner (green) alag highlight. Console output char-by-char build hota hai — row/col Watch mein dikhte hain.',
    tip: 'Inner loop = ek row ke andar; outer = kitni rows.',
  },
};

/** Problem-specific rich explanations (override templates) */
const CUSTOM: Record<string, Partial<ProblemApproach>> = {
  'array-insert-at': {
    problem: 'Array ke beech kisi index par naya element insert karna — pehle jagah khali karni padti hai (right shift).',
    approach: [
      'Size 1 badhao (n+1 slots mentally).',
      'i = n-1 se pos tak: arr[i+1] = arr[i] (RIGHT shift).',
      'Khali slot arr[pos] par val rakho.',
    ],
    solution:
      'Har shift step alag snapshot hai — moving cell yellow, empty slot dashed. Debugger line 4 par loop hai, line 6 par assign. Overwrite avoid karne ke liye loop ulta chalao.',
    tip: 'Right-to-left loop mandatory — warna data lost!',
  },
  'array-delete-at': {
    problem: 'Kisi index ka element delete karna — baaki elements left shift karke gap band hota hai.',
    approach: ['arr[pos] note karo (remove).', 'i = pos se end: arr[i] = arr[i+1].', 'Size 1 kam (pop).'],
    solution:
      'Pehle red "Removing" badge, phir har left shift alag step. Last duplicate slot pop se hatao.',
    tip: 'Left shift = loop pos se aage ki taraf.',
  },
  'array-kadane': {
    problem: 'Maximum subarray sum — contiguous elements ka sabse bada total.',
    approach: ['currentSum aur maxSum rakho.', 'Element add karo currentSum mein.', 'Agar currentSum < 0 → reset 0 se.'],
    solution: 'Reset moment visualization mein clearly dikhega — negative sum discard. Kadane O(n) optimal hai.',
    tip: 'All negative? Max element hi answer.',
  },
  'array-binary-search': {
    problem: 'Sorted array mein target dhundho — har step par half eliminate.',
    approach: ['lo=0, hi=n-1', 'mid compute', 'Compare arr[mid] with target', 'Narrow lo/hi'],
    solution: 'Search range shrink animation — O(log n). Debugger har mid compare par rukega.',
    tip: 'Unsorted par binary search kaam nahi karta!',
  },
  'array-pair-sum': {
    problem: 'Sorted array mein do numbers jinka sum = target — two pointer se.',
    approach: ['left=0, right=n-1', 'Sum compare target se', 'Chhota sum → left++', 'Bada sum → right--'],
    solution: 'Dono pointers move hote dikhenge. Match par green highlight.',
    tip: 'Sorted hona zaroori — warna hash map use karo.',
  },
  'loops-print-1-to-n': {
    problem: '1 se N tak numbers print karna — basic counting loop.',
    approach: ['n input lo', 'i = 1 se n tak loop', 'har step par i print'],
    solution: 'Counter box har step badhta hai. Output line mein numbers append hote hain.',
    tip: 'Yeh Type A ka sabse simple example hai.',
  },
  'loops-fibonacci': {
    problem: 'Fibonacci series ke pehle N terms — har term = pichhle do ka sum.',
    approach: ['Start 0, 1', 'Loop: next = a + b', 'Shift: a=b, b=next', 'Append next'],
    solution: 'Arrows purane terms se naye term ki taraf — dependency clear.',
    tip: 'Tribonacci mein 3 terms combine hote hain.',
  },
};

function templateFor(type: MovementType): Template {
  return (
    MOVEMENT[type] ?? {
      problem: (t) => `${t} — standard algorithm pattern.`,
      approach: () => [
        'Problem ke input ko samjho.',
        'Required variables initialize karo.',
        'Main loop / condition logic apply karo.',
        'Answer return ya print karo.',
      ],
      solution: () => 'Movement type ke hisaab se standard DSA pattern follow hota hai.',
    }
  );
}

export function buildExplanation(p: ProblemConfig): ProblemApproach {
  const keys = Object.keys(p.defaultInput as Record<string, unknown>);
  const algo = getAlgorithmForId(p.id);
  const custom = CUSTOM[p.id];

  if (algo) {
    return {
      problem: custom?.problem ?? algo.problem,
      variables: custom?.variables ?? vars(keys),
      approach: custom?.approach ?? algo.approach,
      solution: custom?.solution ?? algo.solution,
      tip: custom?.tip ?? algo.tip,
    };
  }

  const t = templateFor(p.movementType);
  return {
    problem: custom?.problem ?? t.problem(p.title),
    variables: custom?.variables ?? vars(keys),
    approach: custom?.approach ?? t.approach(p.title),
    solution: custom?.solution ?? t.solution(p.title),
    tip: custom?.tip ?? t.tip,
  };
}

/** Har line par beginner-friendly comments add karta hai — original logic safe rehti hai */
function decorateBeginnerCode(lines: string[], p: ProblemConfig): string[] {
  const out: string[] = [];
  const hasHeader = lines.some((l) => l.includes('# ---'));

  if (!hasHeader) {
    out.push(`# --- ${p.title} ---`);
    out.push('# Debugger: Step dabao → highlighted line ab execute ho rahi hai');
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      out.push(line);
      continue;
    }
    if (line.includes('#')) {
      out.push(line);
      continue;
    }

    let suffix = '';
    if (/^arr = list\(map/.test(trimmed)) suffix = '  # input array read karo';
    else if (/^for i in range\(len\(arr\)/.test(trimmed)) suffix = '  # index i se har element';
    else if (/^for x in arr:/.test(trimmed)) suffix = '  # x = current element (value)';
    else if (/^for .+ in range/.test(trimmed)) suffix = '  # loop — har iteration ek debugger step';
    else if (/^while /.test(trimmed)) suffix = '  # condition true → body chalega';
    else if (/total \+=/.test(trimmed)) suffix = '     # running sum (Watch: total)';
    else if (/total = 0/.test(trimmed) || /total = 0\.0/.test(trimmed)) suffix = '  # accumulator shuru';
    else if (/prod \*=/.test(trimmed)) suffix = '     # running product';
    else if (/count \+=/.test(trimmed) || /count = count \+/.test(trimmed)) suffix = '     # counter badhao';
    else if (/count = 0/.test(trimmed)) suffix = '  # counter shuru';
    else if (/if arr\[i\] ==/.test(trimmed) || /if x ==/.test(trimmed)) suffix = '  # match check';
    else if (/^if /.test(trimmed)) suffix = '  # condition true/false → branch';
    else if (/^elif /.test(trimmed)) suffix = '  # alternate condition';
    else if (/^else:/.test(trimmed)) suffix = '  # koi condition match nahi hui';
    else if (/^print\(/.test(trimmed)) suffix = '  # output console mein';
    else if (/^return /.test(trimmed)) suffix = '  # answer wapas bhejo';
    else if (/^break/.test(trimmed)) suffix = '  # loop yahin ruk jayega';
    else if (/^continue/.test(trimmed)) suffix = '  # is iteration ko skip, aage badho';
    else if (/arr\[.+\] =/.test(trimmed)) suffix = '  # array update — viz mein cell change';
    else if (/left|right|lo|hi|mid/.test(trimmed) && /=/.test(trimmed)) suffix = '  # pointer/range update';
    else if (/max\(|min\(/.test(trimmed)) suffix = '  # best answer update';
    else if (/\.append\(/.test(trimmed)) suffix = '  # result list mein jodo';
    else if (/\.pop\(/.test(trimmed)) suffix = '  # last element hatao (size kam)';
    else if (/seen\[|seen\.|freq\[|map\[/.test(trimmed)) suffix = '  # hash map update';
    else if (/^pass$/.test(trimmed)) suffix = '  # yahan apna logic — simulation dekho';

    out.push(suffix ? `${line}${suffix}` : line);
  }

  return out;
}

export function enrichBeginnerCode(p: ProblemConfig): string[] {
  const custom = CUSTOM_CODE[p.id];
  if (custom) return custom;

  const lines = p.codeLines;
  const meaningfulLogic = lines.some((l: string) => {
    const t = l.trim();
    if (!t || t.startsWith('#')) return false;
    if (t === 'pass') return false;
    if (/^(arr|n|x|k|pos|val|target|a|b|num) =/.test(t)) return false;
    if (/^print\(/.test(t) && lines.length <= 3) return false;
    return true;
  });

  if (meaningfulLogic || lines.length >= 3) {
    return decorateBeginnerCode(lines, p);
  }

  return codeTemplate(p);
}

const CUSTOM_CODE: Record<string, string[]> = {
  'array-insert-at': [
    '# Insert val at index pos',
    'n = len(arr)',
    '# Step 1: right shift — loop ulta chalao',
    'for i in range(n - 1, pos - 1, -1):',
    '    arr[i + 1] = arr[i]      # ek slot right',
    '# Step 2: value rakho',
    'arr[pos] = val',
  ],
  'array-delete-at': [
    '# Delete at index pos',
    'removed = arr[pos]             # yaad rakho',
    'for i in range(pos, n - 1):',
    '    arr[i] = arr[i + 1]        # left shift',
    'arr.pop()                      # size kam',
  ],
  'array-sum': [
    'arr = list(map(int, input().split()))',
    'total = 0                      # accumulator',
    'for i in range(len(arr)):',
    '    total = total + arr[i]     # har element jodo',
    'print(total)',
  ],
  'array-linear-search': [
    'arr = list(map(int, input().split()))',
    'x = int(input())               # target',
    'for i in range(len(arr)):',
    '    if arr[i] == x:            # match?',
    '        print(i)               # index mila',
    '        break',
    'else:',
    '    print(-1)                  # nahi mila',
  ],
  'loops-print-1-to-n': [
    'n = int(input())',
    'for i in range(1, n + 1):      # 1 se n tak',
    '    print(i)                   # current number',
  ],
};

function codeTemplate(p: ProblemConfig): string[] {
  const header = ['# --- Input ---'];
  const keys = Object.keys(p.defaultInput as Record<string, unknown>);

  if (p.module === 'loops') {
    if (p.movementType === 'T') {
      return [
        ...header,
        'n = int(input())',
        'for row in range(1, n + 1):       # outer: har row',
        '    for col in range(1, row + 1): # inner: har column',
        '        print(value, end=" ")     # ek char print',
        '    print()                        # newline',
      ];
    }
    if (p.movementType === 'Q') {
      return [
        ...header,
        'num = int(input())',
        'while num > 0:',
        '    digit = num % 10             # last digit',
        '    # process(digit)             # sum/count/reverse',
        '    num = num // 10              # number chhota',
      ];
    }
    return [
      ...header,
      'n = int(input())',
      'for i in range(1, n + 1):',
      '    # loop body — Watch panel dekho',
      '    pass',
    ];
  }

  if (keys.includes('arr')) {
    const extras = keys.filter((k) => k !== 'arr');
    const inputLines = [
      'arr = list(map(int, input().split()))',
      ...extras.map((k) => `${k} = int(input())  # ${VAR_HINTS[k] ?? k}`),
    ];
    const body = bodyForMovement(p.movementType);
    return [...header, ...inputLines, ...body];
  }

  return p.codeLines;
}

function bodyForMovement(type: MovementType): string[] {
  switch (type) {
    case 'B':
      return [
        'left, right = 0, len(arr) - 1',
        'while left < right:',
        '    # compare / swap — pointers move',
        '    left += 1',
        '    right -= 1',
      ];
    case 'C':
      return [
        'window_sum = 0',
        'for end in range(len(arr)):',
        '    window_sum += arr[end]       # expand',
        '    # shrink window if needed',
      ];
    case 'D':
      return [
        'lo, hi = 0, len(arr) - 1',
        'while lo <= hi:',
        '    mid = (lo + hi) // 2',
        '    # compare arr[mid] with target',
      ];
    case 'F':
      return [
        'seen = {}',
        'for i in range(len(arr)):',
        '    # update hashmap / check duplicate',
        '    pass',
      ];
    case 'G':
      return [
        'best = arr[0]',
        'current = 0',
        'for x in arr:',
        '    current = max(x, current + x)  # extend or reset',
        '    best = max(best, current)',
      ];
    default:
      return [
        'for i in range(len(arr)):',
        '    # process arr[i] — debugger step se dekho',
        '    pass',
      ];
  }
}
