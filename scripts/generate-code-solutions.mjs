import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function walk(d) {
  const out = [];
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) out.push(...walk(p));
    else if (f.name.startsWith('level') && f.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

const problems = [];
for (const f of walk(path.join(root, 'src/modules'))) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/id:\s*'([^']+)',\s*\n\s*title:\s*'([^']+)'/g)) {
    problems.push({ id: m[1], title: m[2] });
  }
}

function solution(pyBody, javaBody, javaLineOffset = 5, javaExtra = []) {
  const java = [
    'import java.util.*;',
    '',
    'public class Solution {',
    '    public static void main(String[] args) {',
    '        Scanner sc = new Scanner(System.in);',
    ...javaBody.map((l) => '        ' + l),
    '    }',
    ...javaExtra.map((l) => '    ' + l),
    '}',
  ];
  return { python: pyBody, java, javaLineOffset };
}

function readArr(init = '') {
  return init ? `arr = list(map(int, input().split())); ${init}` : 'arr = list(map(int, input().split()))';
}

function jReadArr(setup = []) {
  return [
    'String[] parts = sc.nextLine().split("\\\\s+");',
    'int[] arr = new int[parts.length];',
    'for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i]);',
    ...setup,
  ];
}

function idx(body, init = '', print) {
  const py = [readArr(init), 'for i in range(len(arr)):', `    ${body}`];
  if (print != null) py.push(`print(${print})`);
  return py;
}

function val(body, init = '', print) {
  const py = [readArr(init), 'for x in arr:', `    ${body}`];
  if (print != null) py.push(`print(${print})`);
  return py;
}

function jIdx(body, setup = [], print) {
  const j = [...jReadArr(setup), 'for (int i = 0; i < arr.length; i++) {', `    ${body}`, '}'];
  if (print) j.push(print);
  return j;
}

function jVal(body, setup = [], print) {
  const j = [...jReadArr(setup), 'for (int x : arr) {', `    ${body}`, '}'];
  if (print) j.push(print);
  return j;
}

function mkIdx(body, init, print, jBody, jSetup = [], jPrint) {
  return solution(idx(body, init, print), jIdx(jBody, jSetup, jPrint));
}

function mkVal(body, init, print, jBody, jSetup = [], jPrint) {
  return solution(val(body, init, print), jVal(jBody, jSetup, jPrint));
}

function digit(init, process, print) {
  const py = ['num = int(input())', init, 'while num > 0:', '    digit = num % 10', `    ${process}`, '    num = num // 10'];
  if (print != null) py.push(`print(${print})`);
  return py;
}

function jDigit(init, process, print) {
  const j = ['int num = sc.nextInt();', init, 'while (num > 0) {', '    int digit = num % 10;', `    ${process}`, '    num /= 10;', '}'];
  if (print) j.push(print);
  return j;
}

function mkDigit(init, process, print, jInit, jProcess, jPrint) {
  return solution(digit(init, process, print), jDigit(jInit, jProcess, jPrint));
}

function nested(pyLines, javaLines) {
  return solution(pyLines, javaLines);
}

const PATTERN_NUM = [
  'n = int(input())',
  'for row in range(1, n + 1):',
  '    for col in range(1, row + 1):',
  '        print(col, end=" ")',
  '    print()',
];

const PATTERN_STAR = [
  'n = int(input())',
  'for row in range(1, n + 1):',
  '    for col in range(1, row + 1):',
  '        print("*", end=" ")',
  '    print()',
];

const J_PATTERN = [
  'int n = sc.nextInt();',
  'for (int row = 1; row <= n; row++) {',
  '    for (int col = 1; col <= row; col++) {',
  '        System.out.print(VAL + " ");',
  '    }',
  '    System.out.println();',
  '}',
];

function patternNumbers(javaVal = 'col') {
  const j = J_PATTERN.map((l) => l.replace('VAL', javaVal));
  return nested(PATTERN_NUM, j);
}

function patternStars() {
  const j = J_PATTERN.map((l) => l.replace('VAL', '"*"'));
  return nested(PATTERN_STAR, j);
}

/** @type {Record<string, () => { python: string[]; java: string[]; javaLineOffset: number }>} */
const BUILDERS = {
  // ─── Array Level 1 ───────────────────────────────────────────────────────
  'array-display': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'print(arr)'],
      ['String[] parts = sc.nextLine().split("\\\\s+");', 'int[] arr = new int[parts.length];', 'for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i]);', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-display-reverse-readonly': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr) - 1, -1, -1):', '    print(arr[i])'],
      [...jReadArr(), 'for (int i = arr.length - 1; i >= 0; i--) {', '    System.out.println(arr[i]);', '}'],
    ),
  'array-sum': () => mkIdx('total += arr[i]', 'total = 0', 'total', 'total += arr[i];', ['int total = 0;'], 'System.out.println(total);'),
  'array-average': () =>
    solution(
      ['arr = list(map(int, input().split())); total = 0', 'for i in range(len(arr)):', '    total += arr[i]', 'print(total / len(arr))'],
      [...jReadArr(['int total = 0;']), 'for (int i = 0; i < arr.length; i++) {', '    total += arr[i];', '}', 'System.out.println((double) total / arr.length);'],
    ),
  'array-count-gt-x': () => mkVal('if x > X: count += 1', 'x = int(input()); count = 0', 'count', 'if (x > X) count++;', ['int X = sc.nextInt();', 'int count = 0;'], 'System.out.println(count);'),
  'array-count-lt-x': () => mkVal('if x < X: count += 1', 'x = int(input()); count = 0', 'count', 'if (x < X) count++;', ['int X = sc.nextInt();', 'int count = 0;'], 'System.out.println(count);'),
  'array-count-even-odd': () =>
    solution(
      ['arr = list(map(int, input().split())); evens = odds = 0', 'for x in arr:', '    if x % 2 == 0: evens += 1', '    else: odds += 1', 'print(evens, odds)'],
      [...jReadArr(['int evens = 0, odds = 0;']), 'for (int x : arr) {', '    if (x % 2 == 0) evens++;', '    else odds++;', '}', 'System.out.println(evens + " " + odds);'],
    ),
  'array-count-signs': () =>
    mkVal(
      'if x > 0: pos += 1\n    elif x < 0: neg += 1\n    else: zero += 1',
      'pos = neg = zero = 0',
      'pos, neg, zero',
      'if (x > 0) pos++; else if (x < 0) neg++; else zero++;',
      ['int pos = 0, neg = 0, zero = 0;'],
      'System.out.println(pos + " " + neg + " " + zero);',
    ),
  'array-sum-evens': () => mkVal('if x % 2 == 0: total += x', 'total = 0', 'total', 'if (x % 2 == 0) total += x;', ['int total = 0;'], 'System.out.println(total);'),
  'array-sum-odds': () => mkVal('if x % 2 != 0: total += x', 'total = 0', 'total', 'if (x % 2 != 0) total += x;', ['int total = 0;'], 'System.out.println(total);'),
  'array-product': () => mkIdx('prod *= arr[i]', 'prod = 1', 'prod', 'prod *= arr[i];', ['int prod = 1;'], 'System.out.println(prod);'),
  'array-element-exists': () =>
    solution(
      ['arr = list(map(int, input().split())); x = int(input())', 'for i in range(len(arr)):', '    if arr[i] == x: print(True); break', 'else: print(False)'],
      [...jReadArr(['int x = sc.nextInt();']), 'boolean found = false;', 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] == x) { found = true; break; }', '}', 'System.out.println(found);'],
    ),

  // ─── Array Level 2 ───────────────────────────────────────────────────────
  'array-find-max': () => mkIdx('if arr[i] > maxVal: maxVal = arr[i]', 'maxVal = arr[0]', 'maxVal', 'if (arr[i] > maxVal) maxVal = arr[i];', ['int maxVal = arr[0];'], 'System.out.println(maxVal);'),
  'array-find-min': () => mkIdx('if arr[i] < minVal: minVal = arr[i]', 'minVal = arr[0]', 'minVal', 'if (arr[i] < minVal) minVal = arr[i];', ['int minVal = arr[0];'], 'System.out.println(minVal);'),
  'array-find-max-min': () =>
    solution(
      ['arr = list(map(int, input().split())); maxVal = minVal = arr[0]', 'for i in range(len(arr)):', '    if arr[i] > maxVal: maxVal = arr[i]\n    if arr[i] < minVal: minVal = arr[i]', 'print(maxVal, minVal)'],
      [...jReadArr(['int maxVal = arr[0], minVal = arr[0];']), 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] > maxVal) maxVal = arr[i];', '    if (arr[i] < minVal) minVal = arr[i];', '}', 'System.out.println(maxVal + " " + minVal);'],
    ),
  'array-position-max': () => mkIdx('if arr[i] > maxVal: maxVal, maxIdx = arr[i], i', 'maxVal, maxIdx = arr[0], 0', 'maxIdx', 'if (arr[i] > maxVal) { maxVal = arr[i]; maxIdx = i; }', ['int maxVal = arr[0], maxIdx = 0;'], 'System.out.println(maxIdx);'),
  'array-position-min': () => mkIdx('if arr[i] < minVal: minVal, minIdx = arr[i], i', 'minVal, minIdx = arr[0], 0', 'minIdx', 'if (arr[i] < minVal) { minVal = arr[i]; minIdx = i; }', ['int minVal = arr[0], minIdx = 0;'], 'System.out.println(minIdx);'),
  'array-linear-search': () =>
    solution(
      ['arr = list(map(int, input().split())); x = int(input())', 'for i in range(len(arr)):', '    if arr[i] == x: print(i); break', 'else: print(-1)'],
      [...jReadArr(['int x = sc.nextInt();']), 'int result = -1;', 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] == x) { result = i; break; }', '}', 'System.out.println(result);'],
    ),
  'array-count-occurrences': () => mkIdx('if arr[i] == x: count += 1', 'x = int(input()); count = 0', 'count', 'if (arr[i] == x) count++;', ['int x = sc.nextInt();', 'int count = 0;'], 'System.out.println(count);'),
  'array-first-occurrence': () =>
    solution(
      ['arr = list(map(int, input().split())); x = int(input())', 'for i in range(len(arr)):', '    if arr[i] == x: print(i); break'],
      [...jReadArr(['int x = sc.nextInt();']), 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] == x) { System.out.println(i); break; }', '}'],
    ),
  'array-last-occurrence': () => mkIdx('if arr[i] == x: last = i', 'x = int(input()); last = -1', 'last', 'if (arr[i] == x) last = i;', ['int x = sc.nextInt();', 'int last = -1;'], 'System.out.println(last);'),
  'array-all-positions': () =>
    solution(
      ['arr = list(map(int, input().split())); x = int(input()); positions = []', 'for i in range(len(arr)):', '    if arr[i] == x: positions.append(i)', 'print(positions)'],
      [...jReadArr(['int x = sc.nextInt();', 'ArrayList<Integer> positions = new ArrayList<>();']), 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] == x) positions.add(i);', '}', 'System.out.println(positions);'],
    ),
  'array-check-duplicates': () =>
    solution(
      ['arr = list(map(int, input().split())); seen = set()', 'for i in range(len(arr)):', '    if arr[i] in seen: print(True); break\n    seen.add(arr[i])', 'else: print(False)'],
      [...jReadArr(), 'HashSet<Integer> seen = new HashSet<>();', 'boolean dup = false;', 'for (int i = 0; i < arr.length; i++) {', '    if (seen.contains(arr[i])) { dup = true; break; }', '    seen.add(arr[i]);', '}', 'System.out.println(dup);'],
    ),
  'array-first-duplicate': () =>
    solution(
      ['arr = list(map(int, input().split())); seen = set()', 'for i in range(len(arr)):', '    if arr[i] in seen: print(arr[i]); break\n    seen.add(arr[i])'],
      [...jReadArr(), 'HashSet<Integer> seen = new HashSet<>();', 'int dup = -1;', 'for (int i = 0; i < arr.length; i++) {', '    if (seen.contains(arr[i])) { dup = arr[i]; break; }', '    seen.add(arr[i]);', '}', 'System.out.println(dup);'],
    ),
  'array-count-distinct': () =>
    solution(
      ['arr = list(map(int, input().split())); seen = set()', 'for i in range(len(arr)):', '    seen.add(arr[i])', 'print(len(seen))'],
      [...jReadArr(), 'HashSet<Integer> seen = new HashSet<>();', 'for (int i = 0; i < arr.length; i++) seen.add(arr[i]);', 'System.out.println(seen.size());'],
    ),
  'array-frequency-table': () =>
    solution(
      ['arr = list(map(int, input().split())); freq = {}', 'for i in range(len(arr)):', '    freq[arr[i]] = freq.get(arr[i], 0) + 1', 'print(freq)'],
      [...jReadArr(), 'HashMap<Integer, Integer> freq = new HashMap<>();', 'for (int i = 0; i < arr.length; i++) {', '    freq.put(arr[i], freq.getOrDefault(arr[i], 0) + 1);', '}', 'System.out.println(freq);'],
    ),
  'array-max-frequency': () =>
    solution(
      ['arr = list(map(int, input().split())); freq = {}; best = 0', 'for i in range(len(arr)):', '    freq[arr[i]] = freq.get(arr[i], 0) + 1\n    if freq[arr[i]] > best: best, bestKey = freq[arr[i]], arr[i]', 'print(bestKey)'],
      [...jReadArr(), 'HashMap<Integer, Integer> freq = new HashMap<>();', 'int best = 0, bestKey = arr[0];', 'for (int i = 0; i < arr.length; i++) {', '    freq.put(arr[i], freq.getOrDefault(arr[i], 0) + 1);', '    if (freq.get(arr[i]) > best) { best = freq.get(arr[i]); bestKey = arr[i]; }', '}', 'System.out.println(bestKey);'],
    ),

  // ─── Array Level 3 ───────────────────────────────────────────────────────
  'array-reverse-inplace': () =>
    solution(
      ['arr = list(map(int, input().split())); left, right = 0, len(arr) - 1', 'while left < right:', '    arr[left], arr[right] = arr[right], arr[left]\n    left += 1; right -= 1', 'print(arr)'],
      [...jReadArr(), 'int left = 0, right = arr.length - 1;', 'while (left < right) {', '    int t = arr[left]; arr[left] = arr[right]; arr[right] = t;', '    left++; right--;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-swap-first-last': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'arr[0], arr[-1] = arr[-1], arr[0]', 'print(arr)'],
      [...jReadArr(), 'int t = arr[0]; arr[0] = arr[arr.length - 1]; arr[arr.length - 1] = t;', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-swap-at': () =>
    solution(
      ['arr = list(map(int, input().split())); i, j = map(int, input().split())', 'arr[i], arr[j] = arr[j], arr[i]', 'print(arr)'],
      [...jReadArr(), 'int i = sc.nextInt(), j = sc.nextInt();', 'int t = arr[i]; arr[i] = arr[j]; arr[j] = t;', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-rotate-left-1': () =>
    solution(
      ['arr = list(map(int, input().split())); first = arr[0]', 'for i in range(len(arr) - 1):', '    arr[i] = arr[i + 1]', 'arr[-1] = first\nprint(arr)'],
      [...jReadArr(), 'int first = arr[0];', 'for (int i = 0; i < arr.length - 1; i++) arr[i] = arr[i + 1];', 'arr[arr.length - 1] = first;', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-rotate-right-1': () =>
    solution(
      ['arr = list(map(int, input().split())); last = arr[-1]', 'for i in range(len(arr) - 1, 0, -1):', '    arr[i] = arr[i - 1]', 'arr[0] = last\nprint(arr)'],
      [...jReadArr(), 'int last = arr[arr.length - 1];', 'for (int i = arr.length - 1; i > 0; i--) arr[i] = arr[i - 1];', 'arr[0] = last;', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-rotate-left-k': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()) % len(arr)', 'for _ in range(k):', '    first = arr.pop(0); arr.append(first)', 'print(arr)'],
      [...jReadArr(['int k = sc.nextInt() % arr.length;']), 'for (int t = 0; t < k; t++) {', '    int first = arr[0];', '    for (int i = 0; i < arr.length - 1; i++) arr[i] = arr[i + 1];', '    arr[arr.length - 1] = first;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-rotate-right-k': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()) % len(arr)', 'for _ in range(k):', '    last = arr.pop(); arr.insert(0, last)', 'print(arr)'],
      [...jReadArr(['int k = sc.nextInt() % arr.length;']), 'for (int t = 0; t < k; t++) {', '    int last = arr[arr.length - 1];', '    for (int i = arr.length - 1; i > 0; i--) arr[i] = arr[i - 1];', '    arr[0] = last;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-copy': () =>
    solution(
      ['arr = list(map(int, input().split())); dest = []', 'for x in arr:', '    dest.append(x)', 'print(dest)'],
      [...jReadArr(), 'ArrayList<Integer> dest = new ArrayList<>();', 'for (int x : arr) dest.add(x);', 'System.out.println(dest);'],
    ),
  'array-insert-at': () =>
    solution(
      ['arr = list(map(int, input().split())); pos, val = map(int, input().split())', 'for i in range(len(arr) - 1, pos - 1, -1):', '    arr[i + 1] = arr[i]', 'arr.insert(pos, val)\nprint(arr)'],
      [...jReadArr(), 'int pos = sc.nextInt(), val = sc.nextInt();', 'for (int i = arr.length - 1; i >= pos; i--) {', '    arr[i + 1] = arr[i];', '}', 'arr[pos] = val;', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-delete-at': () =>
    solution(
      ['arr = list(map(int, input().split())); pos = int(input())', 'for i in range(pos, len(arr) - 1):', '    arr[i] = arr[i + 1]', 'arr.pop()\nprint(arr)'],
      [...jReadArr(['int pos = sc.nextInt();']), 'for (int i = pos; i < arr.length - 1; i++) arr[i] = arr[i + 1];', 'System.out.println(Arrays.toString(Arrays.copyOf(arr, arr.length - 1)));'],
    ),
  'array-insert-sorted': () =>
    solution(
      ['arr = list(map(int, input().split())); val = int(input())', 'for i in range(len(arr)):', '    if arr[i] > val: arr.insert(i, val); break\nelse: arr.append(val)', 'print(arr)'],
      [...jReadArr(['int val = sc.nextInt();']), 'int pos = arr.length;', 'for (int i = 0; i < arr.length; i++) { if (arr[i] > val) { pos = i; break; } }', 'int[] out = new int[arr.length + 1];', 'for (int i = 0; i < pos; i++) out[i] = arr[i];', 'out[pos] = val;', 'for (int i = pos; i < arr.length; i++) out[i + 1] = arr[i];', 'System.out.println(Arrays.toString(out));'],
    ),
  'array-remove-all-x': () =>
    solution(
      ['arr = list(map(int, input().split())); x = int(input()); slow = 0', 'for fast in range(len(arr)):', '    if arr[fast] != x: arr[slow] = arr[fast]; slow += 1', 'print(arr[:slow])'],
      [...jReadArr(['int x = sc.nextInt();', 'int slow = 0;']), 'for (int fast = 0; fast < arr.length; fast++) {', '    if (arr[fast] != x) arr[slow++] = arr[fast];', '}', 'System.out.println(Arrays.toString(Arrays.copyOf(arr, slow)));'],
    ),
  'array-replace-all': () =>
    solution(
      ['arr = list(map(int, input().split())); x, y = map(int, input().split())', 'for i in range(len(arr)):', '    if arr[i] == x: arr[i] = y', 'print(arr)'],
      [...jReadArr(['int x = sc.nextInt(), y = sc.nextInt();']), 'for (int i = 0; i < arr.length; i++) { if (arr[i] == x) arr[i] = y; }', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-merge-two': () =>
    solution(
      ['a = list(map(int, input().split())); b = list(map(int, input().split())); i = j = 0; dest = []', 'while i < len(a) or j < len(b):', '    if j >= len(b) or (i < len(a) and a[i] <= b[j]): dest.append(a[i]); i += 1\n    else: dest.append(b[j]); j += 1', 'print(dest)'],
      ['String[] pa = sc.nextLine().split("\\\\s+");', 'String[] pb = sc.nextLine().split("\\\\s+");', 'int[] a = new int[pa.length], b = new int[pb.length];', 'for (int i = 0; i < pa.length; i++) a[i] = Integer.parseInt(pa[i]);', 'for (int i = 0; i < pb.length; i++) b[i] = Integer.parseInt(pb[i]);', 'ArrayList<Integer> dest = new ArrayList<>();', 'int i = 0, j = 0;', 'while (i < a.length || j < b.length) {', '    if (j >= b.length || (i < a.length && a[i] <= b[j])) dest.add(a[i++]);', '    else dest.add(b[j++]);', '}', 'System.out.println(dest);'],
    ),
  'array-concat': () =>
    solution(
      ['a = list(map(int, input().split())); b = list(map(int, input().split()))', 'for x in b:', '    a.append(x)', 'print(a)'],
      ['String[] pa = sc.nextLine().split("\\\\s+");', 'String[] pb = sc.nextLine().split("\\\\s+");', 'ArrayList<Integer> a = new ArrayList<>();', 'for (String s : pa) a.add(Integer.parseInt(s));', 'for (String s : pb) a.add(Integer.parseInt(s));', 'System.out.println(a);'],
    ),
  'array-split-halves': () =>
    solution(
      ['arr = list(map(int, input().split())); mid = len(arr) // 2', 'left, right = arr[:mid], arr[mid:]', 'print(left, right)'],
      [...jReadArr(), 'int mid = arr.length / 2;', 'System.out.println(Arrays.toString(Arrays.copyOfRange(arr, 0, mid)) + " " + Arrays.toString(Arrays.copyOfRange(arr, mid, arr.length)));'],
    ),
  'array-separate-even-odd': () =>
    solution(
      ['arr = list(map(int, input().split())); write = 0', 'for read in range(len(arr)):', '    if arr[read] % 2 == 0: arr[write], arr[read] = arr[read], arr[write]; write += 1', 'print(arr)'],
      [...jReadArr(['int write = 0;']), 'for (int read = 0; read < arr.length; read++) {', '    if (arr[read] % 2 == 0) { int t = arr[write]; arr[write] = arr[read]; arr[read] = t; write++; }', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-move-zeros': () =>
    solution(
      ['arr = list(map(int, input().split())); write = 0', 'for read in range(len(arr)):', '    if arr[read] != 0: arr[write], arr[read] = arr[read], arr[write]; write += 1', 'print(arr)'],
      [...jReadArr(['int write = 0;']), 'for (int read = 0; read < arr.length; read++) {', '    if (arr[read] != 0) { int t = arr[write]; arr[write] = arr[read]; arr[read] = t; write++; }', '}', 'System.out.println(Arrays.toString(arr));'],
    ),

  // ─── Array Level 4 ───────────────────────────────────────────────────────
  'array-check-sorted-asc': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(1, len(arr)):', '    if arr[i] <= arr[i - 1]: print(False); break', 'else: print(True)'],
      [...jReadArr(), 'boolean ok = true;', 'for (int i = 1; i < arr.length; i++) {', '    if (arr[i] <= arr[i - 1]) { ok = false; break; }', '}', 'System.out.println(ok);'],
    ),
  'array-check-sorted-desc': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(1, len(arr)):', '    if arr[i] >= arr[i - 1]: print(False); break', 'else: print(True)'],
      [...jReadArr(), 'boolean ok = true;', 'for (int i = 1; i < arr.length; i++) {', '    if (arr[i] >= arr[i - 1]) { ok = false; break; }', '}', 'System.out.println(ok);'],
    ),
  'array-check-sorted-nondec': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(1, len(arr)):', '    if arr[i] < arr[i - 1]: print(False); break', 'else: print(True)'],
      [...jReadArr(), 'boolean ok = true;', 'for (int i = 1; i < arr.length; i++) {', '    if (arr[i] < arr[i - 1]) { ok = false; break; }', '}', 'System.out.println(ok);'],
    ),
  'array-check-palindrome': () =>
    solution(
      ['arr = list(map(int, input().split())); left, right = 0, len(arr) - 1', 'while left < right:', '    if arr[left] != arr[right]: print(False); break\n    left += 1; right -= 1', 'else: print(True)'],
      [...jReadArr(), 'int left = 0, right = arr.length - 1; boolean ok = true;', 'while (left < right) {', '    if (arr[left] != arr[right]) { ok = false; break; }', '    left++; right--;', '}', 'System.out.println(ok);'],
    ),
  'array-sum-even-indices': () =>
    solution(
      ['arr = list(map(int, input().split())); total = 0', 'for i in range(0, len(arr), 2):', '    total += arr[i]', 'print(total)'],
      [...jReadArr(['int total = 0;']), 'for (int i = 0; i < arr.length; i += 2) total += arr[i];', 'System.out.println(total);'],
    ),
  'array-sum-odd-indices': () =>
    solution(
      ['arr = list(map(int, input().split())); total = 0', 'for i in range(1, len(arr), 2):', '    total += arr[i]', 'print(total)'],
      [...jReadArr(['int total = 0;']), 'for (int i = 1; i < arr.length; i += 2) total += arr[i];', 'System.out.println(total);'],
    ),
  'array-diff-even-odd-sum': () =>
    solution(
      ['arr = list(map(int, input().split())); even_sum = odd_sum = 0', 'for i in range(len(arr)):', '    if i % 2 == 0: even_sum += arr[i]\n    else: odd_sum += arr[i]', 'print(even_sum - odd_sum)'],
      [...jReadArr(['int even = 0, odd = 0;']), 'for (int i = 0; i < arr.length; i++) {', '    if (i % 2 == 0) even += arr[i]; else odd += arr[i];', '}', 'System.out.println(even - odd);'],
    ),
  'array-range': () =>
    solution(
      ['arr = list(map(int, input().split())); maxVal = minVal = arr[0]', 'for i in range(len(arr)):', '    if arr[i] > maxVal: maxVal = arr[i]\n    if arr[i] < minVal: minVal = arr[i]', 'print(maxVal - minVal)'],
      [...jReadArr(['int maxVal = arr[0], minVal = arr[0];']), 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] > maxVal) maxVal = arr[i];', '    if (arr[i] < minVal) minVal = arr[i];', '}', 'System.out.println(maxVal - minVal);'],
    ),
  'array-second-largest': () =>
    solution(
      ['arr = list(map(int, input().split())); best = second = float("-inf")', 'for i in range(len(arr)):', '    if arr[i] > best: second, best = best, arr[i]\n    elif arr[i] > second and arr[i] < best: second = arr[i]', 'print(second)'],
      [...jReadArr(['int best = Integer.MIN_VALUE, second = Integer.MIN_VALUE;']), 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] > best) { second = best; best = arr[i]; }', '    else if (arr[i] > second && arr[i] < best) second = arr[i];', '}', 'System.out.println(second);'],
    ),
  'array-second-smallest': () =>
    solution(
      ['arr = list(map(int, input().split())); best = second = float("inf")', 'for i in range(len(arr)):', '    if arr[i] < best: second, best = best, arr[i]\n    elif arr[i] < second and arr[i] > best: second = arr[i]', 'print(second)'],
      [...jReadArr(['int best = Integer.MAX_VALUE, second = Integer.MAX_VALUE;']), 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] < best) { second = best; best = arr[i]; }', '    else if (arr[i] < second && arr[i] > best) second = arr[i];', '}', 'System.out.println(second);'],
    ),
  'array-kth-largest': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input())', 'for _ in range(k):', '    best = max(arr); arr.remove(best)', 'print(best)'],
      [...jReadArr(['int k = sc.nextInt();']), 'int best = 0;', 'for (int r = 0; r < k; r++) {', '    best = arr[0]; int idx = 0;', '    for (int i = 1; i < arr.length; i++) if (arr[i] > best) { best = arr[i]; idx = i; }', '    arr[idx] = Integer.MIN_VALUE;', '}', 'System.out.println(best);'],
    ),
  'array-kth-smallest': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input())', 'for _ in range(k):', '    best = min(arr); arr.remove(best)', 'print(best)'],
      [...jReadArr(['int k = sc.nextInt();']), 'int best = 0;', 'for (int r = 0; r < k; r++) {', '    best = arr[0]; int idx = 0;', '    for (int i = 1; i < arr.length; i++) if (arr[i] < best) { best = arr[i]; idx = i; }', '    arr[idx] = Integer.MAX_VALUE;', '}', 'System.out.println(best);'],
    ),
  'array-count-gt-avg': () =>
    solution(
      ['arr = list(map(int, input().split())); avg = sum(arr) / len(arr); count = 0', 'for i in range(len(arr)):', '    if arr[i] > avg: count += 1', 'print(count)'],
      [...jReadArr(), 'double avg = 0; for (int v : arr) avg += v; avg /= arr.length;', 'int count = 0;', 'for (int i = 0; i < arr.length; i++) if (arr[i] > avg) count++;', 'System.out.println(count);'],
    ),
  'array-count-lt-avg': () =>
    solution(
      ['arr = list(map(int, input().split())); avg = sum(arr) / len(arr); count = 0', 'for i in range(len(arr)):', '    if arr[i] < avg: count += 1', 'print(count)'],
      [...jReadArr(), 'double avg = 0; for (int v : arr) avg += v; avg /= arr.length;', 'int count = 0;', 'for (int i = 0; i < arr.length; i++) if (arr[i] < avg) count++;', 'System.out.println(count);'],
    ),
  'array-longest-increasing-run': () =>
    solution(
      ['arr = list(map(int, input().split())); best = cur = 1', 'for i in range(1, len(arr)):', '    cur = cur + 1 if arr[i] > arr[i - 1] else 1\n    best = max(best, cur)', 'print(best)'],
      [...jReadArr(['int best = 1, cur = 1;']), 'for (int i = 1; i < arr.length; i++) {', '    cur = arr[i] > arr[i - 1] ? cur + 1 : 1;', '    best = Math.max(best, cur);', '}', 'System.out.println(best);'],
    ),

  // ─── Array Level 5 ───────────────────────────────────────────────────────
  'array-pair-sum': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); arr.sort(); left, right = 0, len(arr) - 1', 'while left < right:', '    s = arr[left] + arr[right]\n    if s == target: print(left, right); break\n    elif s < target: left += 1\n    else: right -= 1'],
      [...jReadArr(['int target = sc.nextInt();']), 'Arrays.sort(arr);', 'int left = 0, right = arr.length - 1;', 'while (left < right) {', '    int s = arr[left] + arr[right];', '    if (s == target) { System.out.println(left + " " + right); break; }', '    else if (s < target) left++; else right--;', '}'],
    ),
  'array-count-pairs-sum': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); arr.sort(); left, right = 0, len(arr) - 1; count = 0', 'while left < right:', '    s = arr[left] + arr[right]\n    if s == target: count += 1; left += 1; right -= 1\n    elif s < target: left += 1\n    else: right -= 1', 'print(count)'],
      [...jReadArr(['int target = sc.nextInt();']), 'Arrays.sort(arr);', 'int left = 0, right = arr.length - 1, count = 0;', 'while (left < right) {', '    int s = arr[left] + arr[right];', '    if (s == target) { count++; left++; right--; }', '    else if (s < target) left++; else right--;', '}', 'System.out.println(count);'],
    ),
  'array-all-pairs-sum': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); arr.sort(); left, right = 0, len(arr) - 1; pairs = []', 'while left < right:', '    s = arr[left] + arr[right]\n    if s == target: pairs.append((left, right)); left += 1; right -= 1\n    elif s < target: left += 1\n    else: right -= 1', 'print(pairs)'],
      [...jReadArr(['int target = sc.nextInt();']), 'Arrays.sort(arr);', 'int left = 0, right = arr.length - 1;', 'ArrayList<String> pairs = new ArrayList<>();', 'while (left < right) {', '    int s = arr[left] + arr[right];', '    if (s == target) { pairs.add(left + "," + right); left++; right--; }', '    else if (s < target) left++; else right--;', '}', 'System.out.println(pairs);'],
    ),
  'array-triplet-sum': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); arr.sort()', 'for k in range(len(arr)):', '    left, right = k + 1, len(arr) - 1\n    while left < right:\n        s = arr[k] + arr[left] + arr[right]\n        if s == target: print(k, left, right); break\n        elif s < target: left += 1\n        else: right -= 1'],
      [...jReadArr(['int target = sc.nextInt();']), 'Arrays.sort(arr);', 'for (int k = 0; k < arr.length; k++) {', '    int left = k + 1, right = arr.length - 1;', '    while (left < right) {', '        int s = arr[k] + arr[left] + arr[right];', '        if (s == target) { System.out.println(k + " " + left + " " + right); return; }', '        else if (s < target) left++; else right--;', '    }', '}'],
    ),
  'array-count-pairs-diff': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); arr.sort(); left, right = 0, 1; count = 0', 'while right < len(arr):', '    if abs(arr[right] - arr[left]) == k: count += 1\n    if abs(arr[right] - arr[left]) < k: right += 1\n    else: left += 1\n    if left == right: right += 1', 'print(count)'],
      [...jReadArr(['int k = sc.nextInt();']), 'Arrays.sort(arr);', 'int left = 0, right = 1, count = 0;', 'while (right < arr.length) {', '    if (Math.abs(arr[right] - arr[left]) == k) count++;', '    if (Math.abs(arr[right] - arr[left]) < k) right++; else left++;', '    if (left == right) right++;', '}', 'System.out.println(count);'],
    ),
  'array-max-sum-k-window': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); window = sum(arr[:k]); best = window', 'for start in range(1, len(arr) - k + 1):', '    window = window - arr[start - 1] + arr[start + k - 1]\n    best = max(best, window)', 'print(best)'],
      [...jReadArr(['int k = sc.nextInt();']), 'int window = 0; for (int i = 0; i < k; i++) window += arr[i];', 'int best = window;', 'for (int start = 1; start <= arr.length - k; start++) {', '    window = window - arr[start - 1] + arr[start + k - 1];', '    best = Math.max(best, window);', '}', 'System.out.println(best);'],
    ),
  'array-min-sum-k-window': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); window = sum(arr[:k]); best = window', 'for start in range(1, len(arr) - k + 1):', '    window = window - arr[start - 1] + arr[start + k - 1]\n    best = min(best, window)', 'print(best)'],
      [...jReadArr(['int k = sc.nextInt();']), 'int window = 0; for (int i = 0; i < k; i++) window += arr[i];', 'int best = window;', 'for (int start = 1; start <= arr.length - k; start++) {', '    window = window - arr[start - 1] + arr[start + k - 1];', '    best = Math.min(best, window);', '}', 'System.out.println(best);'],
    ),
  'array-first-negative-window': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input())', 'for start in range(len(arr) - k + 1):', '    window = arr[start:start + k]\n    neg = next((x for x in window if x < 0), 0)\n    print(neg)'],
      [...jReadArr(['int k = sc.nextInt();']), 'for (int start = 0; start <= arr.length - k; start++) {', '    int firstNeg = 0; boolean found = false;', '    for (int j = start; j < start + k; j++) if (arr[j] < 0) { firstNeg = arr[j]; found = true; break; }', '    System.out.println(found ? firstNeg : 0);', '}'],
    ),
  'array-max-every-window': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input())', 'for start in range(len(arr) - k + 1):', '    print(max(arr[start:start + k]))'],
      [...jReadArr(['int k = sc.nextInt();']), 'for (int start = 0; start <= arr.length - k; start++) {', '    int maxVal = arr[start];', '    for (int j = start; j < start + k; j++) maxVal = Math.max(maxVal, arr[j]);', '    System.out.println(maxVal);', '}'],
    ),
  'array-count-subarrays-sum-k': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); prefix = {0: 1}; total = count = 0', 'for i in range(len(arr)):', '    total += arr[i]\n    count += prefix.get(total - k, 0)\n    prefix[total] = prefix.get(total, 0) + 1', 'print(count)'],
      [...jReadArr(['int k = sc.nextInt();']), 'HashMap<Integer, Integer> prefix = new HashMap<>(); prefix.put(0, 1);', 'int total = 0, count = 0;', 'for (int i = 0; i < arr.length; i++) {', '    total += arr[i];', '    count += prefix.getOrDefault(total - k, 0);', '    prefix.put(total, prefix.getOrDefault(total, 0) + 1);', '}', 'System.out.println(count);'],
    ),
  'array-subarray-given-sum': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); left = total = 0', 'for right in range(len(arr)):', '    total += arr[right]\n    while total > k and left <= right: total -= arr[left]; left += 1\n    if total == k: print(left, right); break'],
      [...jReadArr(['int k = sc.nextInt();']), 'int left = 0, total = 0;', 'for (int right = 0; right < arr.length; right++) {', '    total += arr[right];', '    while (total > k && left <= right) { total -= arr[left++]; }', '    if (total == k) { System.out.println(left + " " + right); break; }', '}'],
    ),
  'array-longest-subarray-sum-k': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); left = total = best = 0', 'for right in range(len(arr)):', '    total += arr[right]\n    while total > k and left <= right: total -= arr[left]; left += 1\n    if total == k: best = max(best, right - left + 1)', 'print(best)'],
      [...jReadArr(['int k = sc.nextInt();']), 'int left = 0, total = 0, best = 0;', 'for (int right = 0; right < arr.length; right++) {', '    total += arr[right];', '    while (total > k && left <= right) total -= arr[left++];', '    if (total == k) best = Math.max(best, right - left + 1);', '}', 'System.out.println(best);'],
    ),

  // ─── Array Level 6 ───────────────────────────────────────────────────────
  'array-kadane': () =>
    solution(
      ['arr = list(map(int, input().split())); best = cur = arr[0]', 'for i in range(1, len(arr)):', '    cur = max(arr[i], cur + arr[i])\n    best = max(best, cur)', 'print(best)'],
      [...jReadArr(), 'int best = arr[0], cur = arr[0];', 'for (int i = 1; i < arr.length; i++) {', '    cur = Math.max(arr[i], cur + arr[i]);', '    best = Math.max(best, cur);', '}', 'System.out.println(best);'],
    ),
  'array-max-product-subarray': () =>
    solution(
      ['arr = list(map(int, input().split())); maxP = minP = best = arr[0]', 'for i in range(1, len(arr)):', '    v = arr[i]\n    tmp = max(v, maxP * v, minP * v)\n    minP = min(v, maxP * v, minP * v)\n    maxP = tmp\n    best = max(best, maxP)', 'print(best)'],
      [...jReadArr(), 'int maxP = arr[0], minP = arr[0], best = arr[0];', 'for (int i = 1; i < arr.length; i++) {', '    int v = arr[i];', '    int tmp = Math.max(v, Math.max(maxP * v, minP * v));', '    minP = Math.min(v, Math.min(maxP * v, minP * v));', '    maxP = tmp; best = Math.max(best, maxP);', '}', 'System.out.println(best);'],
    ),
  'array-equilibrium': () =>
    solution(
      ['arr = list(map(int, input().split())); total = sum(arr); left = 0', 'for i in range(len(arr)):', '    right = total - left - arr[i]\n    if left == right: print(i); break\n    left += arr[i]'],
      [...jReadArr(), 'int total = 0; for (int v : arr) total += v; int left = 0;', 'for (int i = 0; i < arr.length; i++) {', '    int right = total - left - arr[i];', '    if (left == right) { System.out.println(i); break; }', '    left += arr[i];', '}'],
    ),
  'array-leaders': () =>
    solution(
      ['arr = list(map(int, input().split())); maxFromRight = float("-inf"); leaders = []', 'for i in range(len(arr) - 1, -1, -1):', '    if arr[i] >= maxFromRight: leaders.append(arr[i]); maxFromRight = arr[i]', 'print(leaders[::-1])'],
      [...jReadArr(), 'ArrayList<Integer> leaders = new ArrayList<>(); int maxFromRight = Integer.MIN_VALUE;', 'for (int i = arr.length - 1; i >= 0; i--) {', '    if (arr[i] >= maxFromRight) { leaders.add(0, arr[i]); maxFromRight = arr[i]; }', '}', 'System.out.println(leaders);'],
    ),
  'array-peak': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr)):', '    left = arr[i - 1] if i > 0 else float("-inf")\n    right = arr[i + 1] if i + 1 < len(arr) else float("-inf")\n    if arr[i] > left and arr[i] > right: print(i); break'],
      [...jReadArr(), 'for (int i = 0; i < arr.length; i++) {', '    int left = i > 0 ? arr[i - 1] : Integer.MIN_VALUE;', '    int right = i + 1 < arr.length ? arr[i + 1] : Integer.MIN_VALUE;', '    if (arr[i] > left && arr[i] > right) { System.out.println(i); break; }', '}'],
    ),
  'array-all-peaks': () =>
    solution(
      ['arr = list(map(int, input().split())); peaks = []', 'for i in range(len(arr)):', '    left = arr[i - 1] if i > 0 else float("-inf")\n    right = arr[i + 1] if i + 1 < len(arr) else float("-inf")\n    if arr[i] > left and arr[i] > right: peaks.append(i)', 'print(peaks)'],
      [...jReadArr(), 'ArrayList<Integer> peaks = new ArrayList<>();', 'for (int i = 0; i < arr.length; i++) {', '    int left = i > 0 ? arr[i - 1] : Integer.MIN_VALUE;', '    int right = i + 1 < arr.length ? arr[i + 1] : Integer.MIN_VALUE;', '    if (arr[i] > left && arr[i] > right) peaks.add(i);', '}', 'System.out.println(peaks);'],
    ),
  'array-valley': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr)):', '    left = arr[i - 1] if i > 0 else float("inf")\n    right = arr[i + 1] if i + 1 < len(arr) else float("inf")\n    if arr[i] < left and arr[i] < right: print(i); break'],
      [...jReadArr(), 'for (int i = 0; i < arr.length; i++) {', '    int left = i > 0 ? arr[i - 1] : Integer.MAX_VALUE;', '    int right = i + 1 < arr.length ? arr[i + 1] : Integer.MAX_VALUE;', '    if (arr[i] < left && arr[i] < right) { System.out.println(i); break; }', '}'],
    ),
  'array-missing-number': () =>
    solution(
      ['arr = list(map(int, input().split())); n = len(arr); expected = n * (n + 1) // 2; total = 0', 'for i in range(len(arr)):', '    total += arr[i]', 'print(expected - total)'],
      [...jReadArr(), 'int n = arr.length, expected = n * (n + 1) / 2, total = 0;', 'for (int i = 0; i < arr.length; i++) total += arr[i];', 'System.out.println(expected - total);'],
    ),
  'array-find-duplicate': () =>
    solution(
      ['arr = list(map(int, input().split())); seen = set()', 'for i in range(len(arr)):', '    if arr[i] in seen: print(arr[i]); break\n    seen.add(arr[i])'],
      [...jReadArr(), 'HashSet<Integer> seen = new HashSet<>();', 'for (int i = 0; i < arr.length; i++) {', '    if (seen.contains(arr[i])) { System.out.println(arr[i]); break; }', '    seen.add(arr[i]);', '}'],
    ),
  'array-two-missing': () =>
    solution(
      ['arr = list(map(int, input().split())); n = len(arr) + 2; expected = n * (n + 1) // 2; total = sum(arr); diff = expected - total', 'for i in range(len(arr)):', '    pass', 'print("Use sum/xor for two missing:", diff)'],
      [...jReadArr(), 'int n = arr.length + 2, expected = n * (n + 1) / 2, total = 0;', 'for (int v : arr) total += v;', 'System.out.println(expected - total);'],
    ),
  'array-majority-boyer-moore': () =>
    solution(
      ['arr = list(map(int, input().split())); candidate = arr[0]; count = 1', 'for i in range(1, len(arr)):', '    if count == 0: candidate, count = arr[i], 1\n    elif arr[i] == candidate: count += 1\n    else: count -= 1', 'print(candidate)'],
      [...jReadArr(), 'int candidate = arr[0], count = 1;', 'for (int i = 1; i < arr.length; i++) {', '    if (count == 0) { candidate = arr[i]; count = 1; }', '    else if (arr[i] == candidate) count++; else count--;', '}', 'System.out.println(candidate);'],
    ),
  'array-stock-single': () =>
    solution(
      ['arr = list(map(int, input().split())); minPrice = arr[0]; maxProfit = 0', 'for i in range(1, len(arr)):', '    maxProfit = max(maxProfit, arr[i] - minPrice)\n    minPrice = min(minPrice, arr[i])', 'print(maxProfit)'],
      [...jReadArr(), 'int minPrice = arr[0], maxProfit = 0;', 'for (int i = 1; i < arr.length; i++) {', '    maxProfit = Math.max(maxProfit, arr[i] - minPrice);', '    minPrice = Math.min(minPrice, arr[i]);', '}', 'System.out.println(maxProfit);'],
    ),
  'array-stock-multiple': () =>
    solution(
      ['arr = list(map(int, input().split())); profit = 0', 'for i in range(1, len(arr)):', '    if arr[i] > arr[i - 1]: profit += arr[i] - arr[i - 1]', 'print(profit)'],
      [...jReadArr(['int profit = 0;']), 'for (int i = 1; i < arr.length; i++) {', '    if (arr[i] > arr[i - 1]) profit += arr[i] - arr[i - 1];', '}', 'System.out.println(profit);'],
    ),
  'array-rearrange-alt-pos-neg': () =>
    solution(
      ['arr = list(map(int, input().split())); pos, neg = 0, len(arr) - 1', 'for i in range(len(arr)):', '    if arr[i] > 0: arr[pos], arr[i] = arr[i], arr[pos]; pos += 2\n    elif arr[i] < 0: arr[neg], arr[i] = arr[i], arr[neg]; neg -= 2', 'print(arr)'],
      [...jReadArr(), 'int pos = 0, neg = arr.length - 1;', 'for (int i = 0; i < arr.length; i++) {', '    if (arr[i] > 0) { int t = arr[pos]; arr[pos] = arr[i]; arr[i] = t; pos += 2; }', '    else if (arr[i] < 0) { int t = arr[neg]; arr[neg] = arr[i]; arr[i] = t; neg -= 2; }', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-zigzag': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr) - 1):', '    if (i % 2 == 0 and arr[i] > arr[i + 1]) or (i % 2 == 1 and arr[i] < arr[i + 1]):\n        arr[i], arr[i + 1] = arr[i + 1], arr[i]', 'print(arr)'],
      [...jReadArr(), 'for (int i = 0; i < arr.length - 1; i++) {', '    if ((i % 2 == 0 && arr[i] > arr[i + 1]) || (i % 2 == 1 && arr[i] < arr[i + 1])) {', '        int t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t;', '    }', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-dutch-flag': () =>
    solution(
      ['arr = list(map(int, input().split())); low = mid = 0; high = len(arr) - 1', 'while mid <= high:', '    if arr[mid] == 0: arr[low], arr[mid] = arr[mid], arr[low]; low += 1; mid += 1\n    elif arr[mid] == 2: arr[mid], arr[high] = arr[high], arr[mid]; high -= 1\n    else: mid += 1', 'print(arr)'],
      [...jReadArr(), 'int low = 0, mid = 0, high = arr.length - 1;', 'while (mid <= high) {', '    if (arr[mid] == 0) { int t = arr[low]; arr[low] = arr[mid]; arr[mid] = t; low++; mid++; }', '    else if (arr[mid] == 2) { int t = arr[mid]; arr[mid] = arr[high]; arr[high] = t; high--; }', '    else mid++;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-trapping-rain': () =>
    solution(
      ['arr = list(map(int, input().split())); n = len(arr); leftMax = [0] * n; rightMax = [0] * n', 'for i in range(1, n):', '    leftMax[i] = max(leftMax[i - 1], arr[i])', 'for i in range(n - 2, -1, -1):', '    rightMax[i] = max(rightMax[i + 1], arr[i])', 'water = sum(min(leftMax[i], rightMax[i]) - arr[i] for i in range(n))', 'print(water)'],
      [...jReadArr(), 'int n = arr.length; int[] leftMax = new int[n], rightMax = new int[n];', 'leftMax[0] = arr[0]; for (int i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], arr[i]);', 'rightMax[n - 1] = arr[n - 1]; for (int i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], arr[i]);', 'int water = 0; for (int i = 0; i < n; i++) water += Math.max(0, Math.min(leftMax[i], rightMax[i]) - arr[i]);', 'System.out.println(water);'],
    ),
  'array-container-water': () =>
    solution(
      ['arr = list(map(int, input().split())); left, right = 0, len(arr) - 1; best = 0', 'while left < right:', '    best = max(best, min(arr[left], arr[right]) * (right - left))\n    if arr[left] < arr[right]: left += 1\n    else: right -= 1', 'print(best)'],
      [...jReadArr(), 'int left = 0, right = arr.length - 1, best = 0;', 'while (left < right) {', '    best = Math.max(best, Math.min(arr[left], arr[right]) * (right - left));', '    if (arr[left] < arr[right]) left++; else right--;', '}', 'System.out.println(best);'],
    ),
  'array-max-difference': () =>
    solution(
      ['arr = list(map(int, input().split())); minSoFar = arr[0]; best = 0', 'for j in range(1, len(arr)):', '    best = max(best, arr[j] - minSoFar)\n    minSoFar = min(minSoFar, arr[j])', 'print(best)'],
      [...jReadArr(), 'int minSoFar = arr[0], best = 0;', 'for (int j = 1; j < arr.length; j++) {', '    best = Math.max(best, arr[j] - minSoFar);', '    minSoFar = Math.min(minSoFar, arr[j]);', '}', 'System.out.println(best);'],
    ),
  'array-smallest-missing-positive': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr)):', '    while 1 <= arr[i] <= len(arr) and arr[arr[i] - 1] != arr[i]:\n        arr[arr[i] - 1], arr[i] = arr[i], arr[arr[i] - 1]', 'for i in range(len(arr)):', '    if arr[i] != i + 1: print(i + 1); break', 'else: print(len(arr) + 1)'],
      [...jReadArr(), 'for (int i = 0; i < arr.length; i++) {', '    while (arr[i] >= 1 && arr[i] <= arr.length && arr[arr[i] - 1] != arr[i]) {', '        int t = arr[arr[i] - 1]; arr[arr[i] - 1] = arr[i]; arr[i] = t;', '    }', '}', 'for (int i = 0; i < arr.length; i++) if (arr[i] != i + 1) { System.out.println(i + 1); return; }', 'System.out.println(arr.length + 1);'],
    ),

  // ─── Array Level 7 (Sorting) ─────────────────────────────────────────────
  'array-bubble-sort': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr)):', '    for j in range(len(arr) - i - 1):\n        if arr[j] > arr[j + 1]: arr[j], arr[j + 1] = arr[j + 1], arr[j]', 'print(arr)'],
      [...jReadArr(), 'for (int i = 0; i < arr.length; i++) {', '    for (int j = 0; j < arr.length - i - 1; j++) {', '        if (arr[j] > arr[j + 1]) { int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t; }', '    }', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-selection-sort': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(len(arr)):', '    minIdx = i\n    for j in range(i + 1, len(arr)):\n        if arr[j] < arr[minIdx]: minIdx = j\n    arr[i], arr[minIdx] = arr[minIdx], arr[i]', 'print(arr)'],
      [...jReadArr(), 'for (int i = 0; i < arr.length; i++) {', '    int minIdx = i;', '    for (int j = i + 1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;', '    int t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-insertion-sort': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'for i in range(1, len(arr)):', '    key = arr[i]; j = i - 1\n    while j >= 0 and arr[j] > key:\n        arr[j + 1] = arr[j]; j -= 1\n    arr[j + 1] = key', 'print(arr)'],
      [...jReadArr(), 'for (int i = 1; i < arr.length; i++) {', '    int key = arr[i], j = i - 1;', '    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }', '    arr[j + 1] = key;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-counting-sort': () =>
    solution(
      ['arr = list(map(int, input().split())); counts = [0] * 10; out = []', 'for i in range(len(arr)):', '    counts[arr[i]] += 1', 'for d in range(10):', '    out.extend([d] * counts[d])', 'print(out)'],
      [...jReadArr(), 'int[] counts = new int[10];', 'for (int i = 0; i < arr.length; i++) counts[arr[i]]++;', 'ArrayList<Integer> out = new ArrayList<>();', 'for (int d = 0; d < 10; d++) for (int c = 0; c < counts[d]; c++) out.add(d);', 'System.out.println(out);'],
    ),
  'array-sort-0-1': () =>
    solution(
      ['arr = list(map(int, input().split())); write = 0', 'for read in range(len(arr)):', '    if arr[read] == 0: arr[write], arr[read] = arr[read], arr[write]; write += 1', 'print(arr)'],
      [...jReadArr(['int write = 0;']), 'for (int read = 0; read < arr.length; read++) {', '    if (arr[read] == 0) { int t = arr[write]; arr[write] = arr[read]; arr[read] = t; write++; }', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-sort-0-1-2': () =>
    solution(
      ['arr = list(map(int, input().split())); low = mid = 0; high = len(arr) - 1', 'while mid <= high:', '    if arr[mid] == 0: arr[low], arr[mid] = arr[mid], arr[low]; low += 1; mid += 1\n    elif arr[mid] == 2: arr[mid], arr[high] = arr[high], arr[mid]; high -= 1\n    else: mid += 1', 'print(arr)'],
      [...jReadArr(), 'int low = 0, mid = 0, high = arr.length - 1;', 'while (mid <= high) {', '    if (arr[mid] == 0) { int t = arr[low]; arr[low] = arr[mid]; arr[mid] = t; low++; mid++; }', '    else if (arr[mid] == 2) { int t = arr[mid]; arr[mid] = arr[high]; arr[high] = t; high--; }', '    else mid++;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-merge-sorted': () =>
    solution(
      ['a = list(map(int, input().split())); b = list(map(int, input().split())); i = j = 0; dest = []', 'while i < len(a) or j < len(b):', '    if j >= len(b) or (i < len(a) and a[i] <= b[j]): dest.append(a[i]); i += 1\n    else: dest.append(b[j]); j += 1', 'print(dest)'],
      ['String[] pa = sc.nextLine().split("\\\\s+");', 'String[] pb = sc.nextLine().split("\\\\s+");', 'int[] a = new int[pa.length], b = new int[pb.length];', 'for (int i = 0; i < pa.length; i++) a[i] = Integer.parseInt(pa[i]);', 'for (int i = 0; i < pb.length; i++) b[i] = Integer.parseInt(pb[i]);', 'ArrayList<Integer> dest = new ArrayList<>();', 'int i = 0, j = 0;', 'while (i < a.length || j < b.length) {', '    if (j >= b.length || (i < a.length && a[i] <= b[j])) dest.add(a[i++]);', '    else dest.add(b[j++]);', '}', 'System.out.println(dest);'],
    ),
  'array-single-swap-sortable': () =>
    solution(
      ['arr = list(map(int, input().split())); sorted_arr = sorted(arr); mismatches = [i for i in range(len(arr)) if arr[i] != sorted_arr[i]]', 'if len(mismatches) == 2:', '    i, j = mismatches; arr[i], arr[j] = arr[j], arr[i]', 'print(arr == sorted(arr))'],
      [...jReadArr(), 'int[] sorted = arr.clone(); Arrays.sort(sorted);', 'ArrayList<Integer> mis = new ArrayList<>();', 'for (int i = 0; i < arr.length; i++) if (arr[i] != sorted[i]) mis.add(i);', 'if (mis.size() == 2) { int i = mis.get(0), j = mis.get(1); int t = arr[i]; arr[i] = arr[j]; arr[j] = t; }', 'System.out.println(Arrays.equals(arr, sorted));'],
    ),

  // ─── Array Level 8 (Binary Search) ───────────────────────────────────────
  'array-binary-search': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); lo, hi = 0, len(arr) - 1', 'while lo <= hi:', '    mid = (lo + hi) // 2\n    if arr[mid] == target: print(mid); break\n    elif arr[mid] < target: lo = mid + 1\n    else: hi = mid - 1', 'else: print(-1)'],
      [...jReadArr(['int target = sc.nextInt();']), 'int lo = 0, hi = arr.length - 1, result = -1;', 'while (lo <= hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] == target) { result = mid; break; }', '    else if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;', '}', 'System.out.println(result);'],
    ),
  'array-binary-search-recursive': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input())', 'def bs(lo, hi):', '    if lo > hi: return -1\n    mid = (lo + hi) // 2\n    if arr[mid] == target: return mid\n    if arr[mid] < target: return bs(mid + 1, hi)\n    return bs(lo, mid - 1)', 'print(bs(0, len(arr) - 1))'],
      [...jReadArr(['int target = sc.nextInt();']), 'System.out.println(bs(arr, target, 0, arr.length - 1));'],
      5,
      [
        'static int bs(int[] arr, int target, int lo, int hi) {',
        '        if (lo > hi) return -1;',
        '        int mid = (lo + hi) / 2;',
        '        if (arr[mid] == target) return mid;',
        '        if (arr[mid] < target) return bs(arr, target, mid + 1, hi);',
        '        return bs(arr, target, lo, mid - 1);',
        '    }',
      ],
    ),
  'array-bs-first-occurrence': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); lo, hi = 0, len(arr) - 1; result = -1', 'while lo <= hi:', '    mid = (lo + hi) // 2\n    if arr[mid] == target: result = mid; hi = mid - 1\n    elif arr[mid] < target: lo = mid + 1\n    else: hi = mid - 1', 'print(result)'],
      [...jReadArr(['int target = sc.nextInt();']), 'int lo = 0, hi = arr.length - 1, result = -1;', 'while (lo <= hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] == target) { result = mid; hi = mid - 1; }', '    else if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;', '}', 'System.out.println(result);'],
    ),
  'array-bs-last-occurrence': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); lo, hi = 0, len(arr) - 1; result = -1', 'while lo <= hi:', '    mid = (lo + hi) // 2\n    if arr[mid] == target: result = mid; lo = mid + 1\n    elif arr[mid] < target: lo = mid + 1\n    else: hi = mid - 1', 'print(result)'],
      [...jReadArr(['int target = sc.nextInt();']), 'int lo = 0, hi = arr.length - 1, result = -1;', 'while (lo <= hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] == target) { result = mid; lo = mid + 1; }', '    else if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;', '}', 'System.out.println(result);'],
    ),
  'array-bs-count-freq': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input())', 'def first(): lo, hi, res = 0, len(arr)-1, -1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if arr[mid]==target: res=mid; hi=mid-1\n        elif arr[mid]<target: lo=mid+1\n        else: hi=mid-1\n    return res', 'def last(): lo, hi, res = 0, len(arr)-1, -1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if arr[mid]==target: res=mid; lo=mid+1\n        elif arr[mid]<target: lo=mid+1\n        else: hi=mid-1\n    return res', 'f, l = first(), last(); print(0 if f == -1 else l - f + 1)'],
      [...jReadArr(['int target = sc.nextInt();']), 'int first = bsFirst(arr, target), last = bsLast(arr, target);', 'System.out.println(first == -1 ? 0 : last - first + 1);'],
      5,
      [
        'static int bsFirst(int[] arr, int target) {',
        '        int lo = 0, hi = arr.length - 1, res = -1;',
        '        while (lo <= hi) {',
        '            int mid = (lo + hi) / 2;',
        '            if (arr[mid] == target) { res = mid; hi = mid - 1; }',
        '            else if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;',
        '        }',
        '        return res;',
        '    }',
        'static int bsLast(int[] arr, int target) {',
        '        int lo = 0, hi = arr.length - 1, res = -1;',
        '        while (lo <= hi) {',
        '            int mid = (lo + hi) / 2;',
        '            if (arr[mid] == target) { res = mid; lo = mid + 1; }',
        '            else if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;',
        '        }',
        '        return res;',
        '    }',
      ],
    ),
  'array-search-rotated': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); lo, hi = 0, len(arr) - 1', 'while lo <= hi:', '    mid = (lo + hi) // 2\n    if arr[mid] == target: print(mid); break\n    if arr[lo] <= arr[mid]:\n        if arr[lo] <= target < arr[mid]: hi = mid - 1\n        else: lo = mid + 1\n    else:\n        if arr[mid] < target <= arr[hi]: lo = mid + 1\n        else: hi = mid - 1'],
      [...jReadArr(['int target = sc.nextInt();']), 'int lo = 0, hi = arr.length - 1;', 'while (lo <= hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] == target) { System.out.println(mid); return; }', '    if (arr[lo] <= arr[mid]) { if (arr[lo] <= target && target < arr[mid]) hi = mid - 1; else lo = mid + 1; }', '    else { if (arr[mid] < target && target <= arr[hi]) lo = mid + 1; else hi = mid - 1; }', '}'],
    ),
  'array-min-rotated': () =>
    solution(
      ['arr = list(map(int, input().split())); lo, hi = 0, len(arr) - 1', 'while lo < hi:', '    mid = (lo + hi) // 2\n    if arr[mid] > arr[hi]: lo = mid + 1\n    else: hi = mid', 'print(lo)'],
      [...jReadArr(), 'int lo = 0, hi = arr.length - 1;', 'while (lo < hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] > arr[hi]) lo = mid + 1; else hi = mid;', '}', 'System.out.println(lo);'],
    ),
  'array-rotation-count': () =>
    solution(
      ['arr = list(map(int, input().split())); lo, hi = 0, len(arr) - 1', 'while lo < hi:', '    mid = (lo + hi) // 2\n    if arr[mid] > arr[hi]: lo = mid + 1\n    else: hi = mid', 'print(lo)'],
      [...jReadArr(), 'int lo = 0, hi = arr.length - 1;', 'while (lo < hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] > arr[hi]) lo = mid + 1; else hi = mid;', '}', 'System.out.println(lo);'],
    ),
  'array-search-insert': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); lo, hi = 0, len(arr) - 1', 'while lo <= hi:', '    mid = (lo + hi) // 2\n    if arr[mid] == target: print(mid); break\n    elif arr[mid] < target: lo = mid + 1\n    else: hi = mid - 1', 'else: print(lo)'],
      [...jReadArr(['int target = sc.nextInt();']), 'int lo = 0, hi = arr.length - 1;', 'while (lo <= hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] == target) { System.out.println(mid); return; }', '    else if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;', '}', 'System.out.println(lo);'],
    ),
  'array-peak-binary-search': () =>
    solution(
      ['arr = list(map(int, input().split())); lo, hi = 0, len(arr) - 1', 'while lo < hi:', '    mid = (lo + hi) // 2\n    if arr[mid] < arr[mid + 1]: lo = mid + 1\n    else: hi = mid', 'print(lo)'],
      [...jReadArr(), 'int lo = 0, hi = arr.length - 1;', 'while (lo < hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] < arr[mid + 1]) lo = mid + 1; else hi = mid;', '}', 'System.out.println(lo);'],
    ),
  'array-sqrt-binary-search': () =>
    solution(
      ['n = int(input()); lo, hi = 0, n', 'while lo < hi:', '    mid = (lo + hi + 1) // 2\n    if mid * mid <= n: lo = mid\n    else: hi = mid - 1', 'print(lo)'],
      ['int n = sc.nextInt();', 'int lo = 0, hi = n;', 'while (lo < hi) {', '    int mid = (lo + hi + 1) / 2;', '    if ((long) mid * mid <= n) lo = mid; else hi = mid - 1;', '}', 'System.out.println(lo);'],
    ),
  'array-floor-ceiling': () =>
    solution(
      ['arr = list(map(int, input().split())); target = int(input()); lo, hi = 0, len(arr) - 1; floor = ceil = -1', 'while lo <= hi:', '    mid = (lo + hi) // 2\n    if arr[mid] == target: floor = ceil = mid; break\n    elif arr[mid] < target: floor = mid; lo = mid + 1\n    else: ceil = mid; hi = mid - 1', 'print(floor, ceil)'],
      [...jReadArr(['int target = sc.nextInt();']), 'int lo = 0, hi = arr.length - 1, floor = -1, ceil = -1;', 'while (lo <= hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] == target) { floor = ceil = mid; break; }', '    else if (arr[mid] < target) { floor = mid; lo = mid + 1; } else { ceil = mid; hi = mid - 1; }', '}', 'System.out.println(floor + " " + ceil);'],
    ),
  'array-count-gt-sorted': () =>
    solution(
      ['arr = list(map(int, input().split())); x = int(input()); lo, hi = 0, len(arr)', 'while lo < hi:', '    mid = (lo + hi) // 2\n    if arr[mid] <= x: lo = mid + 1\n    else: hi = mid', 'print(len(arr) - lo)'],
      [...jReadArr(['int x = sc.nextInt();']), 'int lo = 0, hi = arr.length;', 'while (lo < hi) {', '    int mid = (lo + hi) / 2;', '    if (arr[mid] <= x) lo = mid + 1; else hi = mid;', '}', 'System.out.println(arr.length - lo);'],
    ),
  'array-kth-smallest-bs-answer': () =>
    solution(
      ['arr = list(map(int, input().split())); k = int(input()); lo, hi = min(arr), max(arr)', 'while lo < hi:', '    mid = (lo + hi) // 2\n    count = sum(1 for v in arr if v <= mid)\n    if count < k: lo = mid + 1\n    else: hi = mid', 'print(lo)'],
      [...jReadArr(['int k = sc.nextInt();']), 'int lo = arr[0], hi = arr[0];', 'for (int v : arr) { lo = Math.min(lo, v); hi = Math.max(hi, v); }', 'while (lo < hi) {', '    int mid = (lo + hi) / 2, count = 0;', '    for (int v : arr) if (v <= mid) count++;', '    if (count < k) lo = mid + 1; else hi = mid;', '}', 'System.out.println(lo);'],
    ),
  'array-median-two-sorted': () =>
    solution(
      ['a = list(map(int, input().split())); b = list(map(int, input().split()))', 'if len(a) > len(b): a, b = b, a', 'm, n = len(a), len(b); lo, hi = 0, m', 'while lo <= hi:', '    i = (lo + hi) // 2; j = (m + n + 1) // 2 - i\n    maxLeftA = float("-inf") if i == 0 else a[i-1]\n    minRightA = float("inf") if i == m else a[i]\n    maxLeftB = float("-inf") if j == 0 else b[j-1]\n    minRightB = float("inf") if j == n else b[j]\n    if maxLeftA <= minRightB and maxLeftB <= minRightA:\n        print((max(maxLeftA, maxLeftB) + min(minRightA, minRightB)) / 2); break\n    elif maxLeftA > minRightB: hi = i - 1\n    else: lo = i + 1'],
      ['String[] pa = sc.nextLine().split("\\\\s+");', 'String[] pb = sc.nextLine().split("\\\\s+");', 'int[] a = new int[pa.length], b = new int[pb.length];', 'for (int i = 0; i < pa.length; i++) a[i] = Integer.parseInt(pa[i]);', 'for (int i = 0; i < pb.length; i++) b[i] = Integer.parseInt(pb[i]);', 'if (a.length > b.length) { int[] t = a; a = b; b = t; }', 'int m = a.length, n = b.length, lo = 0, hi = m;', 'while (lo <= hi) {', '    int i = (lo + hi) / 2, j = (m + n + 1) / 2 - i;', '    int maxLeftA = i == 0 ? Integer.MIN_VALUE : a[i - 1];', '    int minRightA = i == m ? Integer.MAX_VALUE : a[i];', '    int maxLeftB = j == 0 ? Integer.MIN_VALUE : b[j - 1];', '    int minRightB = j == n ? Integer.MAX_VALUE : b[j];', '    if (maxLeftA <= minRightB && maxLeftB <= minRightA) {', '        System.out.println((Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0); return;', '    } else if (maxLeftA > minRightB) hi = i - 1; else lo = i + 1;', '}'],
    ),

  // ─── Array Level 9 (Advanced) ──────────────────────────────────────────────
  'array-longest-consecutive': () =>
    solution(
      ['arr = list(map(int, input().split())); nums = set(arr); best = 0', 'for num in arr:', '    if num - 1 not in nums:\n        cur = num; length = 1\n        while cur + 1 in nums: cur += 1; length += 1\n        best = max(best, length)', 'print(best)'],
      [...jReadArr(), 'HashSet<Integer> nums = new HashSet<>(); for (int v : arr) nums.add(v);', 'int best = 0;', 'for (int num : arr) {', '    if (!nums.contains(num - 1)) {', '        int cur = num, length = 1;', '        while (nums.contains(cur + 1)) { cur++; length++; }', '        best = Math.max(best, length);', '    }', '}', 'System.out.println(best);'],
    ),
  'array-product-except-self': () =>
    solution(
      ['arr = list(map(int, input().split())); n = len(arr); prefix = [1] * n; suffix = [1] * n', 'for i in range(1, n):', '    prefix[i] = prefix[i - 1] * arr[i - 1]', 'for i in range(n - 2, -1, -1):', '    suffix[i] = suffix[i + 1] * arr[i + 1]', 'out = [prefix[i] * suffix[i] for i in range(n)]', 'print(out)'],
      [...jReadArr(), 'int n = arr.length; int[] prefix = new int[n], suffix = new int[n];', 'prefix[0] = suffix[n - 1] = 1;', 'for (int i = 1; i < n; i++) prefix[i] = prefix[i - 1] * arr[i - 1];', 'for (int i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * arr[i + 1];', 'int[] out = new int[n]; for (int i = 0; i < n; i++) out[i] = prefix[i] * suffix[i];', 'System.out.println(Arrays.toString(out));'],
    ),
  'array-shuffle-fisher-yates': () =>
    solution(
      ['import random\narr = list(map(int, input().split()))', 'for i in range(len(arr) - 1, 0, -1):', '    j = random.randint(0, i); arr[i], arr[j] = arr[j], arr[i]', 'print(arr)'],
      [...jReadArr(), 'Random rnd = new Random();', 'for (int i = arr.length - 1; i > 0; i--) {', '    int j = rnd.nextInt(i + 1);', '    int t = arr[i]; arr[i] = arr[j]; arr[j] = t;', '}', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-next-permutation': () =>
    solution(
      ['arr = list(map(int, input().split())); i = len(arr) - 2', 'while i >= 0 and arr[i] >= arr[i + 1]: i -= 1', 'if i >= 0:', '    j = len(arr) - 1\n    while arr[j] <= arr[i]: j -= 1\n    arr[i], arr[j] = arr[j], arr[i]', 'left, right = i + 1, len(arr) - 1', 'while left < right: arr[left], arr[right] = arr[right], arr[left]; left += 1; right -= 1', 'print(arr)'],
      [...jReadArr(), 'int i = arr.length - 2;', 'while (i >= 0 && arr[i] >= arr[i + 1]) i--;', 'if (i >= 0) {', '    int j = arr.length - 1; while (arr[j] <= arr[i]) j--;', '    int t = arr[i]; arr[i] = arr[j]; arr[j] = t;', '}', 'int left = i + 1, right = arr.length - 1;', 'while (left < right) { int t = arr[left]; arr[left] = arr[right]; arr[right] = t; left++; right--; }', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-previous-permutation': () =>
    solution(
      ['arr = list(map(int, input().split())); i = len(arr) - 2', 'while i >= 0 and arr[i] <= arr[i + 1]: i -= 1', 'if i >= 0:', '    j = len(arr) - 1\n    while arr[j] >= arr[i]: j -= 1\n    arr[i], arr[j] = arr[j], arr[i]', 'left, right = i + 1, len(arr) - 1', 'while left < right: arr[left], arr[right] = arr[right], arr[left]; left += 1; right -= 1', 'print(arr)'],
      [...jReadArr(), 'int i = arr.length - 2;', 'while (i >= 0 && arr[i] <= arr[i + 1]) i--;', 'if (i >= 0) {', '    int j = arr.length - 1; while (arr[j] >= arr[i]) j--;', '    int t = arr[i]; arr[i] = arr[j]; arr[j] = t;', '}', 'int left = i + 1, right = arr.length - 1;', 'while (left < right) { int t = arr[left]; arr[left] = arr[right]; arr[right] = t; left++; right--; }', 'System.out.println(Arrays.toString(arr));'],
    ),
  'array-max-xor-subarray': () =>
    solution(
      ['arr = list(map(int, input().split())); best = 0', 'for i in range(len(arr)):', '    xor = 0\n    for j in range(i, len(arr)):\n        xor ^= arr[j]\n        best = max(best, xor)', 'print(best)'],
      [...jReadArr(), 'int best = 0;', 'for (int i = 0; i < arr.length; i++) {', '    int xor = 0;', '    for (int j = i; j < arr.length; j++) { xor ^= arr[j]; best = Math.max(best, xor); }', '}', 'System.out.println(best);'],
    ),
  'array-count-inversions': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'def merge_sort(a):', '    if len(a) <= 1: return a, 0\n    mid = len(a)//2\n    left, invL = merge_sort(a[:mid])\n    right, invR = merge_sort(a[mid:])\n    merged, invM = merge(left, right)\n    return merged, invL + invR + invM', 'def merge(l, r): inv=0; out=[]; i=j=0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]: out.append(l[i]); i+=1\n        else: out.append(r[j]); inv += len(l)-i; j+=1\n    return out + l[i:] + r[j:], inv', '_, inv = merge_sort(arr); print(inv)'],
      [...jReadArr(), 'System.out.println(countInversions(arr.clone(), 0, arr.length - 1));'],
      5,
      [
        'static long countInversions(int[] arr, int lo, int hi) {',
        '        if (lo >= hi) return 0;',
        '        int mid = (lo + hi) / 2;',
        '        long inv = countInversions(arr, lo, mid) + countInversions(arr, mid + 1, hi);',
        '        int[] temp = new int[hi - lo + 1]; int i = lo, j = mid + 1, k = 0;',
        '        while (i <= mid && j <= hi) {',
        '            if (arr[i] <= arr[j]) temp[k++] = arr[i++];',
        '            else { temp[k++] = arr[j++]; inv += mid - i + 1; }',
        '        }',
        '        while (i <= mid) temp[k++] = arr[i++];',
        '        while (j <= hi) temp[k++] = arr[j++];',
        '        for (int t = 0; t < temp.length; t++) arr[lo + t] = temp[t];',
        '        return inv;',
        '    }',
      ],
    ),
  'array-triplets-zero': () =>
    solution(
      ['arr = list(map(int, input().split())); arr.sort()', 'for k in range(len(arr)):', '    left, right = k + 1, len(arr) - 1\n    while left < right:\n        s = arr[k] + arr[left] + arr[right]\n        if s == 0: print(k, left, right); break\n        elif s < 0: left += 1\n        else: right -= 1'],
      [...jReadArr(), 'Arrays.sort(arr);', 'for (int k = 0; k < arr.length; k++) {', '    int left = k + 1, right = arr.length - 1;', '    while (left < right) {', '        int s = arr[k] + arr[left] + arr[right];', '        if (s == 0) { System.out.println(k + " " + left + " " + right); return; }', '        else if (s < 0) left++; else right--;', '    }', '}'],
    ),
  'array-lis': () =>
    solution(
      ['arr = list(map(int, input().split())); dp = [1] * len(arr)', 'for i in range(1, len(arr)):', '    for j in range(i):\n        if arr[j] < arr[i]: dp[i] = max(dp[i], dp[j] + 1)', 'print(max(dp))'],
      [...jReadArr(), 'int[] dp = new int[arr.length]; Arrays.fill(dp, 1);', 'for (int i = 1; i < arr.length; i++) {', '    for (int j = 0; j < i; j++) if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1);', '}', 'System.out.println(Arrays.stream(dp).max().getAsInt());'],
    ),
  'array-max-circular-subarray': () =>
    solution(
      ['arr = list(map(int, input().split()))', 'def kadane(a):', '    best = cur = a[0]\n    for i in range(1, len(a)):\n        cur = max(a[i], cur + a[i])\n        best = max(best, cur)\n    return best', 'normal = kadane(arr); total = sum(arr); inverted = kadane([-x for x in arr])', 'print(max(normal, total - (-inverted)))'],
      [...jReadArr(), 'int normal = kadane(arr); int total = 0; for (int v : arr) total += v;', 'int[] inv = new int[arr.length]; for (int i = 0; i < arr.length; i++) inv[i] = -arr[i];', 'int invBest = kadane(inv);', 'System.out.println(Math.max(normal, total + invBest));'],
      5,
      [
        'static int kadane(int[] a) {',
        '        int best = a[0], cur = a[0];',
        '        for (int i = 1; i < a.length; i++) {',
        '            cur = Math.max(a[i], cur + a[i]);',
        '            best = Math.max(best, cur);',
        '        }',
        '        return best;',
        '    }',
      ],
    ),

  // ─── Loops Level 1 ─────────────────────────────────────────────────────────
  'loops-print-1-to-n': () =>
    solution(
      ['n = int(input())', 'for i in range(1, n + 1):', '    print(i)'],
      ['int n = sc.nextInt();', 'for (int i = 1; i <= n; i++) {', '    System.out.println(i);', '}'],
    ),
  'loops-print-n-to-1': () =>
    solution(
      ['n = int(input())', 'for i in range(n, 0, -1):', '    print(i)'],
      ['int n = sc.nextInt();', 'for (int i = n; i >= 1; i--) {', '    System.out.println(i);', '}'],
    ),
  'loops-first-n-evens': () =>
    solution(
      ['n = int(input()); count = 0; i = 2', 'while count < n:', '    print(i)\n    count += 1\n    i += 2'],
      ['int n = sc.nextInt(), count = 0, i = 2;', 'while (count < n) {', '    System.out.println(i);', '    count++; i += 2;', '}'],
    ),
  'loops-divisible-by-5': () =>
    solution(
      ['n = int(input())', 'for i in range(1, n + 1):', '    if i % 5 == 0: print(i)'],
      ['int n = sc.nextInt();', 'for (int i = 1; i <= n; i++) {', '    if (i % 5 == 0) System.out.println(i);', '}'],
    ),
  'loops-multiplication-table': () =>
    solution(
      ['n = int(input())', 'for i in range(1, 11):', '    result = n * i', '    print(n, "×", i, "=", result)'],
      ['int n = sc.nextInt();', 'for (int i = 1; i <= 10; i++) {', '    int result = n * i;', '    System.out.println(n + " × " + i + " = " + result);', '}'],
    ),

  // ─── Loops Level 2 ─────────────────────────────────────────────────────────
  'loops-sum-first-n': () =>
    solution(
      ['n = int(input()); total = 0', 'for i in range(1, n + 1):', '    total += i', 'print(total)'],
      ['int n = sc.nextInt(), total = 0;', 'for (int i = 1; i <= n; i++) {', '    total += i;', '}', 'System.out.println(total);'],
    ),
  'loops-factorial': () =>
    solution(
      ['n = int(input()); fact = 1', 'for i in range(1, n + 1):', '    fact *= i', 'print(fact)'],
      ['int n = sc.nextInt(), fact = 1;', 'for (int i = 1; i <= n; i++) {', '    fact *= i;', '}', 'System.out.println(fact);'],
    ),
  'loops-sum-even-odd': () =>
    solution(
      ['n = int(input()); even_sum = odd_sum = 0', 'for i in range(1, n + 1):', '    if i % 2 == 0: even_sum += i\n    else: odd_sum += i', 'print(even_sum, odd_sum)'],
      ['int n = sc.nextInt(), even = 0, odd = 0;', 'for (int i = 1; i <= n; i++) {', '    if (i % 2 == 0) even += i; else odd += i;', '}', 'System.out.println(even + " " + odd);'],
    ),
  'loops-largest-digit': () =>
    mkDigit('max_digit = 0', 'if digit > max_digit: max_digit = digit', 'max_digit', 'int maxDigit = 0;', 'if (digit > maxDigit) maxDigit = digit;', 'System.out.println(maxDigit);'),

  // ─── Loops Level 3 (Digits) ────────────────────────────────────────────────
  'loops-count-digits': () => mkDigit('count = 0', 'count += 1', 'count', 'int count = 0;', 'count++;', 'System.out.println(count);'),
  'loops-sum-digits': () => mkDigit('total = 0', 'total += digit', 'total', 'int total = 0;', 'total += digit;', 'System.out.println(total);'),
  'loops-reverse-number': () => mkDigit('rev = 0', 'rev = rev * 10 + digit', 'rev', 'int rev = 0;', 'rev = rev * 10 + digit;', 'System.out.println(rev);'),

  // ─── Loops Level 4 ─────────────────────────────────────────────────────────
  'loops-check-prime': () =>
    solution(
      ['n = int(input())', 'if n < 2: print("Not prime")', 'else:', '    is_prime = True', '    for d in range(2, int(n**0.5) + 1):', '        if n % d == 0: is_prime = False; break', '    print("Prime" if is_prime else "Not prime")'],
      ['int n = sc.nextInt();', 'if (n < 2) { System.out.println("Not prime"); return; }', 'boolean isPrime = true;', 'for (int d = 2; d * d <= n; d++) {', '    if (n % d == 0) { isPrime = false; break; }', '}', 'System.out.println(isPrime ? "Prime" : "Not prime");'],
    ),
  'loops-print-factors': () =>
    solution(
      ['n = int(input())', 'for i in range(1, n + 1):', '    if n % i == 0: print(i)'],
      ['int n = sc.nextInt();', 'for (int i = 1; i <= n; i++) {', '    if (n % i == 0) System.out.println(i);', '}'],
    ),

  // ─── Loops Level 5 (GCD/LCM) ───────────────────────────────────────────────
  'loops-gcd': () =>
    solution(
      ['a = int(input())', 'b = int(input())', 'while b != 0:', '    a, b = b, a % b', 'print(a)'],
      ['int a = sc.nextInt(), b = sc.nextInt();', 'while (b != 0) {', '    int t = a % b; a = b; b = t;', '}', 'System.out.println(a);'],
    ),
  'loops-lcm': () =>
    solution(
      ['a = int(input()); b = int(input())', 'x, y = a, b', 'while y != 0:', '    x, y = y, x % y', 'gcd_val = x', 'lcm = (a * b) // gcd_val', 'print(lcm)'],
      ['int a = sc.nextInt(), b = sc.nextInt();', 'int x = a, y = b;', 'while (y != 0) { int t = x % y; x = y; y = t; }', 'long lcm = (long) a * b / x;', 'System.out.println(lcm);'],
    ),

  // ─── Loops Level 6 (Sequences) ─────────────────────────────────────────────
  'loops-fibonacci': () =>
    solution(
      ['n = int(input()); a, b = 0, 1; terms = [a, b]', 'for i in range(2, n):', '    next_term = a + b', '    terms.append(next_term)', '    a, b = b, next_term', 'print(terms[:n])'],
      ['int n = sc.nextInt();', 'int a = 0, b = 1;', 'System.out.print(a + " " + b);', 'for (int i = 2; i < n; i++) {', '    int next = a + b;', '    System.out.print(" " + next);', '    a = b; b = next;', '}'],
    ),
  'loops-tribonacci': () =>
    solution(
      ['n = int(input()); a, b, c = 0, 0, 1; terms = [a, b, c]', 'for i in range(3, n):', '    next_term = a + b + c', '    terms.append(next_term)', '    a, b, c = b, c, next_term', 'print(terms[:n])'],
      ['int n = sc.nextInt();', 'int a = 0, b = 0, c = 1;', 'System.out.print(a + " " + b + " " + c);', 'for (int i = 3; i < n; i++) {', '    int next = a + b + c;', '    System.out.print(" " + next);', '    a = b; b = c; c = next;', '}'],
    ),

  // ─── Loops Level 7 (Number patterns) ───────────────────────────────────────
  'loops-right-triangle-numbers': () => patternNumbers(),
  'loops-inverted-triangle-numbers': () =>
    nested(
      ['n = int(input())', 'for row in range(n, 0, -1):', '    for col in range(1, row + 1):', '        print(col, end=" ")', '    print()'],
      ['int n = sc.nextInt();', 'for (int row = n; row >= 1; row--) {', '    for (int col = 1; col <= row; col++) System.out.print(col + " ");', '    System.out.println();', '}'],
    ),
  'loops-centered-pyramid-numbers': () =>
    nested(
      ['n = int(input())', 'for row in range(1, n + 1):', '    print(" " * (n - row), end="")\n    for col in range(1, row + 1): print(col, end=" ")\n    print()'],
      ['int n = sc.nextInt();', 'for (int row = 1; row <= n; row++) {', '    for (int s = 0; s < n - row; s++) System.out.print(" ");', '    for (int col = 1; col <= row; col++) System.out.print(col + " ");', '    System.out.println();', '}'],
    ),
  'loops-hollow-square-numbers': () =>
    nested(
      ['n = int(input())', 'for row in range(1, n + 1):', '    for col in range(1, n + 1):', '        if col == 1 or col == n or row == 1 or row == n: print(col, end=" ")\n        else: print(" ", end=" ")', '    print()'],
      ['int n = sc.nextInt();', 'for (int row = 1; row <= n; row++) {', '    for (int col = 1; col <= n; col++) {', '        if (col == 1 || col == n || row == 1 || row == n) System.out.print(col + " ");', '        else System.out.print("  ");', '    }', '    System.out.println();', '}'],
    ),
  'loops-diamond-numbers': () =>
    nested(
      ['n = int(input())', 'for row in range(1, n + 1):', '    print(" " * (n - row), end="")\n    for col in range(1, row + 1): print(col, end=" ")\n    print()', 'for row in range(n - 1, 0, -1):', '    print(" " * (n - row), end="")\n    for col in range(1, row + 1): print(col, end=" ")\n    print()'],
      ['int n = sc.nextInt();', 'for (int row = 1; row <= n; row++) {', '    for (int s = 0; s < n - row; s++) System.out.print(" ");', '    for (int col = 1; col <= row; col++) System.out.print(col + " ");', '    System.out.println();', '}', 'for (int row = n - 1; row >= 1; row--) {', '    for (int s = 0; s < n - row; s++) System.out.print(" ");', '    for (int col = 1; col <= row; col++) System.out.print(col + " ");', '    System.out.println();', '}'],
    ),

  // ─── Loops Level 8 (Star patterns) ───────────────────────────────────────
  'loops-right-triangle-stars': () => patternStars(),
  'loops-centered-pyramid-stars': () =>
    nested(
      ['n = int(input())', 'for row in range(1, n + 1):', '    print(" " * (n - row), end="")\n    for col in range(1, row + 1): print("*", end=" ")\n    print()'],
      ['int n = sc.nextInt();', 'for (int row = 1; row <= n; row++) {', '    for (int s = 0; s < n - row; s++) System.out.print(" ");', '    for (int col = 1; col <= row; col++) System.out.print("* ");', '    System.out.println();', '}'],
    ),
  'loops-hollow-square-stars': () =>
    nested(
      ['n = int(input())', 'for row in range(1, n + 1):', '    for col in range(1, n + 1):', '        if col == 1 or col == n or row == 1 or row == n: print("*", end=" ")\n        else: print(" ", end=" ")', '    print()'],
      ['int n = sc.nextInt();', 'for (int row = 1; row <= n; row++) {', '    for (int col = 1; col <= n; col++) {', '        if (col == 1 || col == n || row == 1 || row == n) System.out.print("* ");', '        else System.out.print("  ");', '    }', '    System.out.println();', '}'],
    ),
  'loops-diamond-stars': () =>
    nested(
      ['n = int(input())', 'for row in range(1, n + 1):', '    print(" " * (n - row), end="")\n    for col in range(1, row + 1): print("*", end=" ")\n    print()', 'for row in range(n - 1, 0, -1):', '    print(" " * (n - row), end="")\n    for col in range(1, row + 1): print("*", end=" ")\n    print()'],
      ['int n = sc.nextInt();', 'for (int row = 1; row <= n; row++) {', '    for (int s = 0; s < n - row; s++) System.out.print(" ");', '    for (int col = 1; col <= row; col++) System.out.print("* ");', '    System.out.println();', '}', 'for (int row = n - 1; row >= 1; row--) {', '    for (int s = 0; s < n - row; s++) System.out.print(" ");', '    for (int col = 1; col <= row; col++) System.out.print("* ");', '    System.out.println();', '}'],
    ),
};

const missing = problems.filter((p) => !BUILDERS[p.id]);
if (missing.length) {
  console.error('Missing builders:', missing.map((p) => p.id));
  process.exit(1);
}

const lines = [
  '// AUTO-GENERATED — scripts/generate-code-solutions.mjs',
  '',
  'export type CodeSolution = {',
  '  python: string[];',
  '  java: string[];',
  '  javaLineOffset: number;',
  '};',
  '',
  'export const CODE_SOLUTION_BY_ID: Record<string, CodeSolution> = {',
];

for (const p of problems) {
  const block = BUILDERS[p.id]();
  lines.push(`  '${p.id}': ${JSON.stringify(block, null, 4).replace(/\n/g, '\n  ')},`);
}

lines.push('};', '');
lines.push('export function getCodeSolutionForId(id: string): CodeSolution | undefined {');
lines.push('  return CODE_SOLUTION_BY_ID[id];');
lines.push('}', '');

const outPath = path.join(root, 'src/explain/codeSolutionCatalog.ts');
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Wrote ${problems.length} code solutions to ${outPath}`);
