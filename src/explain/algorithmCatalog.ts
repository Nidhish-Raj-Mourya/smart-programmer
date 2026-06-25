// AUTO-GENERATED — scripts/generate-algorithm-catalog.mjs
import type { ProblemApproach } from '../engine/types';

type AlgoBlock = Pick<ProblemApproach, "problem" | "approach" | "solution" | "tip">;

export const ALGORITHM_BY_ID: Record<string, AlgoBlock> = {
  'array-display': {
      "problem": "User se array input lo aur poori array print karo — koi calculation nahi.",
      "approach": [
          "arr = input se read karo",
          "print(arr) se saari values ek saath dikhao"
      ],
      "solution": "Sirf input-output hai. Array memory mein load hoti hai, phir display hoti hai. Time O(n) read, space O(n).",
      "tip": "Pehla array program — sirf read aur print."
  },
  'array-display-reverse-readonly': {
      "problem": "Array ko ulta print karo bina array change kiye — sirf read karna hai.",
      "approach": [
          "i = n-1 se 0 tak loop (ulta direction)",
          "Har step: print(arr[i])",
          "Original array same rehti hai — koi assignment nahi"
      ],
      "solution": "Reverse traversal: index last se first. Read-only hai isliye arr modify nahi hoti. O(n) time."
  },
  'array-sum': {
      "problem": "Array ke saare elements ka total (sum) nikalna hai.",
      "approach": [
          "total = 0",
          "Har i par: total += arr[i]",
          "End par print(total)"
      ],
      "solution": "Classic accumulator pattern. Ek variable mein running sum rakho. O(n) time, O(1) extra space."
  },
  'array-average': {
      "problem": "Array ke elements ka average (mean) = sum / count.",
      "approach": [
          "Pehle total sum nikalo (loop se)",
          "avg = total / len(arr)",
          "print(avg)"
      ],
      "solution": "Do step: pehle sum, phir divide by n. Floating point answer ho sakta hai."
  },
  'array-count-gt-x': {
      "problem": "Kitne elements X se bade hain — count karna hai.",
      "approach": [
          "count = 0",
          "Har element x par: agar x > X to count += 1",
          "print(count)"
      ],
      "solution": "Conditional counting loop. Har element ek baar check — O(n)."
  },
  'array-count-lt-x': {
      "problem": "Kitne elements X se chhote hain.",
      "approach": [
          "count = 0",
          "Har x in arr: agar x < X to count++",
          "print(count)"
      ],
      "solution": "gt-x ka opposite condition. Same O(n) scan."
  },
  'array-count-even-odd': {
      "problem": "Even aur odd elements alag-alag count karo.",
      "approach": [
          "evens = 0, odds = 0",
          "x % 2 == 0 → evens++, warna odds++",
          "Dono print karo"
      ],
      "solution": "Modulo 2 se even/odd decide. Ek pass mein dono counters update."
  },
  'array-count-signs': {
      "problem": "Positive, negative aur zero kitne hain — teen counters.",
      "approach": [
          "pos, neg, zero = 0",
          "Har x: x>0 → pos++, x<0 → neg++, x==0 → zero++"
      ],
      "solution": "Teen-way branch har element par. Single pass O(n)."
  },
  'array-sum-evens': {
      "problem": "Sirf even numbers ka sum chahiye.",
      "approach": [
          "total = 0",
          "Har x: agar x % 2 == 0 to total += x"
      ],
      "solution": "Filter + accumulate ek loop mein. Odd skip ho jate hain."
  },
  'array-sum-odds': {
      "problem": "Sirf odd numbers ka sum.",
      "approach": [
          "total = 0",
          "Har x: agar x % 2 != 0 to total += x"
      ],
      "solution": "x % 2 != 0 wale hi jodte hain."
  },
  'array-product': {
      "problem": "Saare elements ka product (gunna) nikalna hai.",
      "approach": [
          "prod = 1 (sum ki jagah multiply)",
          "Har element: prod *= arr[i]",
          "Zero ho to product 0 ban jata hai"
      ],
      "solution": "Accumulator multiply se. Initial 1 zaroori hai — 0 se multiply mat karo start mein galat logic."
  },
  'array-element-exists': {
      "problem": "Kya value X array mein hai? True/False ya index chahiye.",
      "approach": [
          "Linear scan: har arr[i] == X check",
          "Match mila → True/ index return",
          "Poora scan, nahi mila → False / -1"
      ],
      "solution": "Basic linear search without early exit details — worst case O(n)."
  },
  'array-find-max': {
      "problem": "Array mein sabse bada element kaun sa hai.",
      "approach": [
          "maxVal = arr[0] (pehla assume max)",
          "i = 1 se: agar arr[i] > maxVal to maxVal update",
          "print(maxVal)"
      ],
      "solution": "Running maximum — har naye element se compare. O(n), ek variable enough."
  },
  'array-find-min': {
      "problem": "Sabse chhota element dhundho.",
      "approach": [
          "minVal = arr[0]",
          "Har i: agar arr[i] < minVal to update",
          "print(minVal)"
      ],
      "solution": "Max ka mirror — running minimum."
  },
  'array-find-max-min': {
      "problem": "Ek hi pass mein max aur min dono nikalo.",
      "approach": [
          "maxVal = minVal = arr[0]",
          "i = 1 se end: dono compare/update",
          "Dono print"
      ],
      "solution": "Do alag loops ki jagah ek loop — 2n comparisons bachate hain."
  },
  'array-position-max': {
      "problem": "Maximum element kis index par hai.",
      "approach": [
          "maxVal = arr[0], maxIdx = 0",
          "Agar arr[i] > maxVal: dono update",
          "print(maxIdx)"
      ],
      "solution": "Value ke saath index bhi track karo. Equal max par pehla index rakho (>= vs > policy)."
  },
  'array-position-min': {
      "problem": "Minimum element ka index.",
      "approach": [
          "minVal = arr[0], minIdx = 0",
          "Chhota mila to index save",
          "print(minIdx)"
      ],
      "solution": "Position-max jaisa logic, min ke liye."
  },
  'array-linear-search': {
      "problem": "Target X ka index dhundho — nahi mila to -1.",
      "approach": [
          "for i in range(n):",
          "  if arr[i] == x: return i",
          "Loop khatam → return -1"
      ],
      "solution": "Left to right scan. Best O(1) agar pehle hi mile, worst O(n). break use karo match par."
  },
  'array-count-occurrences': {
      "problem": "X kitni baar aaya hai array mein.",
      "approach": [
          "count = 0",
          "Har element == X ho to count++",
          "print(count)"
      ],
      "solution": "Linear frequency count — poori array scan. O(n)."
  },
  'array-first-occurrence': {
      "problem": "X pehli baar kahan hai — left se scan.",
      "approach": [
          "Left se right loop",
          "Pehla match → index return + break",
          "Nahi mila → -1"
      ],
      "solution": "Linear search with early exit on first hit."
  },
  'array-last-occurrence': {
      "problem": "X aakhri baar kahan hai.",
      "approach": [
          "Right se left loop (i = n-1 to 0)",
          "Pehla match (rightmost) return",
          "Ya left scan mein har match par index update — last wala bachega"
      ],
      "solution": "Reverse traversal ya \"last seen index\" update — dono O(n)."
  },
  'array-all-positions': {
      "problem": "X ke saare indices list karo.",
      "approach": [
          "result = []",
          "Har i: if arr[i]==X: result.append(i)",
          "print(result)"
      ],
      "solution": "Har match collect — O(n) time, O(k) space jahan k = occurrences."
  },
  'array-check-duplicates': {
      "problem": "Kya koi element do baar aaya hai?",
      "approach": [
          "seen = set()",
          "Har x: agar x in seen → duplicate True",
          "Warna seen.add(x)",
          "End → False"
      ],
      "solution": "Hash set se O(1) lookup. Total O(n) time, O(n) space."
  },
  'array-first-duplicate': {
      "problem": "Pehla woh element jo dobara aaya ho.",
      "approach": [
          "seen = set()",
          "Har x: agar x in seen → yeh answer, return",
          "seen.add(x)"
      ],
      "solution": "Insertion order scan — pehla repeat wala element milta hai."
  },
  'array-count-distinct': {
      "problem": "Kitne unique elements hain.",
      "approach": [
          "seen = set()",
          "Har x: seen.add(x)",
          "len(seen) print"
      ],
      "solution": "Set automatically duplicates ignore karta hai."
  },
  'array-frequency-table': {
      "problem": "Har unique element ki frequency map banao.",
      "approach": [
          "freq = {}",
          "Har x: freq[x] = freq.get(x,0) + 1",
          "freq print"
      ],
      "solution": "HashMap counting — key = value, value = count. O(n)."
  },
  'array-max-frequency': {
      "problem": "Sabse zyada baar aane wala element.",
      "approach": [
          "Pehle frequency table banao",
          "freq map par loop — max count wala key dhundho"
      ],
      "solution": "Two phase: count then max over map. O(n) total."
  },
  'array-reverse-inplace': {
      "problem": "Array ko jagah par ulta karo — extra array nahi.",
      "approach": [
          "left = 0, right = n-1",
          "While left < right: swap(arr[left], arr[right])",
          "left++, right--"
      ],
      "solution": "Two pointer swap from ends. O(n) time, O(1) space — in-place."
  },
  'array-swap-first-last': {
      "problem": "Pehla aur aakhri element swap karo.",
      "approach": [
          "temp = arr[0]",
          "arr[0] = arr[n-1]",
          "arr[n-1] = temp"
      ],
      "solution": "Sirf ek swap — 3 assignments. O(1)."
  },
  'array-swap-at': {
      "problem": "Do given indices i aur j par elements swap.",
      "approach": [
          "temp = arr[i]",
          "arr[i] = arr[j]",
          "arr[j] = temp"
      ],
      "solution": "Classic swap with temp variable. i, j valid honi chahiye."
  },
  'array-rotate-left-1': {
      "problem": "Array ek position left rotate — pehla element end par jayega.",
      "approach": [
          "first = arr[0] save karo",
          "Sab elements ek index left shift: arr[i] = arr[i+1]",
          "arr[n-1] = first"
      ],
      "solution": "Left shift + wrap last. O(n) time in-place."
  },
  'array-rotate-right-1': {
      "problem": "Ek position right rotate — last element front par.",
      "approach": [
          "last = arr[n-1]",
          "Right se left: arr[i] = arr[i-1]",
          "arr[0] = last"
      ],
      "solution": "Right shift loop ulta chalao — overwrite se bachne ke liye last pehle save."
  },
  'array-rotate-left-k': {
      "problem": "K positions left rotate.",
      "approach": [
          "K = K % n (effective rotations)",
          "Pehle K elements reverse, phir baaki reverse, phir poori reverse",
          "Ya K baar rotate-left-1 (slow)"
      ],
      "solution": "Reverse trick: reverse(0,k-1), reverse(k,n-1), reverse(0,n-1) — O(n) optimal."
  },
  'array-rotate-right-k': {
      "problem": "K positions right rotate.",
      "approach": [
          "K = K % n",
          "reverse(0,n-1), reverse(0,k-1), reverse(k,n-1)"
      ],
      "solution": "Left K ka reverse pattern — right K ke liye alag reverse order."
  },
  'array-copy': {
      "problem": "Ek array ko doosri mein copy karo.",
      "approach": [
          "arr2 = [] ya same size array",
          "Har i: arr2[i] = arr[i]",
          "arr2 return/print"
      ],
      "solution": "Element-by-element copy. O(n). Shallow copy — nested objects alag topic."
  },
  'array-insert-at': {
      "problem": "Index pos par value val insert — right shift zaroori.",
      "approach": [
          "i = n-1 se pos tak: arr[i+1] = arr[i] (ULTA loop)",
          "arr[pos] = val",
          "Size +1"
      ],
      "solution": "Right-to-left shift overwrite avoid karta hai. O(n) time.",
      "tip": "Loop direction galat hui to data lost!"
  },
  'array-delete-at': {
      "problem": "Index pos ka element hatao — left shift.",
      "approach": [
          "i = pos se n-2: arr[i] = arr[i+1]",
          "Size kam (pop last)"
      ],
      "solution": "Left shift gap band karta hai. O(n)."
  },
  'array-insert-sorted': {
      "problem": "Sorted array mein X sahi jagah insert karo order maintain karke.",
      "approach": [
          "Pehle insert position dhundho (jahan arr[i] > X)",
          "Right shift from that index",
          "Insert X"
      ],
      "solution": "Linear search for position + insert shift. O(n). Binary search se position O(log n) par shift still O(n)."
  },
  'array-remove-all-x': {
      "problem": "X ke saare copies hatao — compact array banao.",
      "approach": [
          "Write pointer w = 0",
          "Har read r: agar arr[r] != X to arr[w++] = arr[r]",
          "Size = w"
      ],
      "solution": "Two pointer compact in-place — O(n), elements preserve order."
  },
  'array-replace-all': {
      "problem": "Har X ko Y se replace karo.",
      "approach": [
          "Har i: if arr[i] == X: arr[i] = Y"
      ],
      "solution": "Simple in-place replace scan. O(n)."
  },
  'array-merge-two': {
      "problem": "Do arrays ko ek merged array mein jodo.",
      "approach": [
          "result = []",
          "Dono arrays ke elements order mein append",
          "result return"
      ],
      "solution": "Concatenation — O(n+m). Sorted merge alag problem hai."
  },
  'array-concat': {
      "problem": "Array B ko A ke end par chipkao.",
      "approach": [
          "Pehle A copy, phir B ke elements append",
          "Ya index se fill"
      ],
      "solution": "A + B concatenation. O(len(A)+len(B))."
  },
  'array-split-halves': {
      "problem": "Array ko do equal (ya nearly equal) halves mein todo.",
      "approach": [
          "mid = n // 2",
          "left = arr[0:mid], right = arr[mid:n]"
      ],
      "solution": "Midpoint split — O(n) copy for both halves."
  },
  'array-separate-even-odd': {
      "problem": "Evens pehle, odds baad mein rearrange (order within group optional).",
      "approach": [
          "Two pointers ya extra array",
          "Evens collect, phir odds",
          "Ya partition like quicksort"
      ],
      "solution": "In-place partition: stable version extra space; unstable two-pointer O(n)."
  },
  'array-move-zeros': {
      "problem": "Saare zeros end par, non-zero order same rakho.",
      "approach": [
          "Write index w = 0",
          "Non-zero ko arr[w++] par likho",
          "Baaki jagah 0 fill"
      ],
      "solution": "Two pointer \"move zeros\" — O(n), in-place stable."
  },
  'array-check-sorted-asc': {
      "problem": "Kya array strictly ascending sorted hai?",
      "approach": [
          "Har i: if arr[i] >= arr[i+1] → False",
          "Poora pass safe → True"
      ],
      "solution": "Adjacent pair check. O(n). Early exit on first violation."
  },
  'array-check-sorted-desc': {
      "problem": "Strictly descending check.",
      "approach": [
          "if arr[i] <= arr[i+1] → False"
      ],
      "solution": "Ascending ka ulta condition."
  },
  'array-check-sorted-nondec': {
      "problem": "Non-decreasing (equal allowed) check.",
      "approach": [
          "if arr[i] > arr[i+1] → False"
      ],
      "solution": "Equal neighbors OK — sirf decrease forbidden."
  },
  'array-check-palindrome': {
      "problem": "Kya array palindrome hai (aage-piche same)?",
      "approach": [
          "left=0, right=n-1",
          "While left<right: if arr[left]!=arr[right] → False",
          "left++, right--",
          "True"
      ],
      "solution": "Two pointer mirror check. O(n), O(1)."
  },
  'array-sum-even-indices': {
      "problem": "Index 0,2,4… par values ka sum.",
      "approach": [
          "total=0, for i in range(0,n,2): total+=arr[i]"
      ],
      "solution": "Step size 2 loop — even indices only. O(n/2)."
  },
  'array-sum-odd-indices': {
      "problem": "Index 1,3,5… ka sum.",
      "approach": [
          "for i in range(1,n,2): total+=arr[i]"
      ],
      "solution": "Start 1, step 2 — odd indices."
  },
  'array-diff-even-odd-sum': {
      "problem": "Even-index sum minus odd-index sum.",
      "approach": [
          "evenSum aur oddSum alag nikalo",
          "answer = evenSum - oddSum"
      ],
      "solution": "Do partial sums ek loop mein bhi ho sakte hain."
  },
  'array-range': {
      "problem": "Range = max - min.",
      "approach": [
          "Pehle max aur min ek pass mein",
          "range = max - min"
      ],
      "solution": "Max-min combo — O(n)."
  },
  'array-second-largest': {
      "problem": "Doosra sabse bada — bina full sort.",
      "approach": [
          "first, second track karo",
          "Har x: agar x > first → shift, elif x > second → second=x",
          "Duplicates handle carefully"
      ],
      "solution": "One pass two-tracker. O(n). Sort O(n log n) se better."
  },
  'array-second-smallest': {
      "problem": "Doosra sabse chhota element.",
      "approach": [
          "first, second minimum track",
          "Har element se update logic"
      ],
      "solution": "Second-largest ka mirror for min values."
  },
  'array-kth-largest': {
      "problem": "Kth largest element (1 = max).",
      "approach": [
          "Sort karke arr[n-k] — simple",
          "Ya quickselect O(n) average",
          "Ya min-heap size K"
      ],
      "solution": "Beginner: partial sort / full sort. Optimal: quickselect or heap O(n log k)."
  },
  'array-kth-smallest': {
      "problem": "Kth smallest element.",
      "approach": [
          "Sort: arr[k-1]",
          "Ya quickselect on kth order"
      ],
      "solution": "Kth largest jaisa — index k-1 after ascending sort."
  },
  'array-count-gt-avg': {
      "problem": "Kitne elements average se bade hain.",
      "approach": [
          "Pehle sum → avg = sum/n",
          "Dusra pass: count jahan arr[i] > avg"
      ],
      "solution": "Two pass mandatory unless running average trick. O(n)."
  },
  'array-count-lt-avg': {
      "problem": "Average se chhote elements count.",
      "approach": [
          "avg nikalo",
          "Second pass count < avg"
      ],
      "solution": "gt-avg ka opposite second pass."
  },
  'array-longest-increasing-run': {
      "problem": "Sabse lambi consecutive increasing subsequence ki length.",
      "approach": [
          "currentRun=1, best=1",
          "Har i: if arr[i]>arr[i-1]: currentRun++, else reset 1",
          "best = max(best, currentRun)"
      ],
      "solution": "Sliding streak counter — O(n)."
  },
  'array-pair-sum': {
      "problem": "Sorted array mein do numbers jinka sum = target.",
      "approach": [
          "left=0, right=n-1",
          "sum = arr[left]+arr[right]",
          "sum<target → left++, sum>target → right--",
          "Equal → pair mila"
      ],
      "solution": "Two pointer on sorted array — O(n). Unsorted needs hash map."
  },
  'array-count-pairs-sum': {
      "problem": "Kitne pairs ka sum target hai (sorted, unique pairs).",
      "approach": [
          "Two pointer jaisa pair-sum",
          "Duplicate values par count logic",
          "Ya hash map complements"
      ],
      "solution": "Sorted: two pointer with skip duplicates. O(n)."
  },
  'array-all-pairs-sum': {
      "problem": "Saare pairs print jinka sum target.",
      "approach": [
          "Two pointer ya nested loop",
          "Har valid pair collect/print"
      ],
      "solution": "Two pointer O(n) sorted; nested O(n²) general."
  },
  'array-triplet-sum': {
      "problem": "Teen numbers jinka sum target (sorted array).",
      "approach": [
          "Fix i, then two pointer on i+1..n-1 for pair sum = target-arr[i]"
      ],
      "solution": "O(n²) — outer i + inner two pointer. Sort first if needed."
  },
  'array-count-pairs-diff': {
      "problem": "Kitne pairs ka difference exactly K hai.",
      "approach": [
          "Hash map: har element ke liye count (x-K) and (x+K) carefully",
          "Ya sort + two pointer"
      ],
      "solution": "Hash map O(n) for general; sorted two pointer for duplicates handling."
  },
  'array-max-sum-k-window': {
      "problem": "K consecutive elements ka maximum sum.",
      "approach": [
          "Pehle window [0..K-1] ka sum",
          "Slide: naya add arr[i], purana arr[i-K] subtract",
          "Har window par max update"
      ],
      "solution": "Fixed sliding window — O(n) after initial O(k). Brute O(n*k) avoid."
  },
  'array-min-sum-k-window': {
      "problem": "K consecutive ka minimum sum.",
      "approach": [
          "Same sliding window, min track instead of max"
      ],
      "solution": "Max window ka mirror — running window sum."
  },
  'array-first-negative-window': {
      "problem": "Har size-K window mein pehla negative number.",
      "approach": [
          "Queue/index list of negatives in window",
          "Slide window, expire old negatives",
          "Front = first negative"
      ],
      "solution": "Deque of indices — O(n). Naive O(n*k)."
  },
  'array-max-every-window': {
      "problem": "Har window size K ka maximum element.",
      "approach": [
          "Monotonic deque: decreasing order mein indices",
          "Front = max for current window"
      ],
      "solution": "Deque maintains candidates — O(n) classic hard sliding window."
  },
  'array-count-subarrays-sum-k': {
      "problem": "Kitne subarrays ka sum exactly K.",
      "approach": [
          "Prefix sum + hashmap",
          "Har prefix P: count how many (P-K) seen before"
      ],
      "solution": "prefixSum[j]-prefixSum[i]=K → O(n) with hash map of prefix frequencies."
  },
  'array-subarray-given-sum': {
      "problem": "Positive array mein subarray jiska sum target (contiguous).",
      "approach": [
          "Two pointer / sliding window",
          "Expand right, shrink left jab sum > target"
      ],
      "solution": "Positive numbers par O(n) two pointer. Negative ho to prefix hash."
  },
  'array-longest-subarray-sum-k': {
      "problem": "Sum K wali sabse lambi subarray ki length.",
      "approach": [
          "Prefix sum + map: earliest index for each prefix",
          "max len for prefix-K"
      ],
      "solution": "Hash map stores first occurrence of prefix — O(n)."
  },
  'array-kadane': {
      "problem": "Maximum subarray sum (contiguous, Kadane).",
      "approach": [
          "currentSum = 0, maxSum = -inf",
          "Har x: currentSum = max(x, currentSum+x)",
          "maxSum = max(maxSum, currentSum)"
      ],
      "solution": "Kadane O(n) O(1). Negative currentSum reset via max(x, current+x)."
  },
  'array-max-product-subarray': {
      "problem": "Maximum product of contiguous subarray.",
      "approach": [
          "maxSoFar, minSoFar (negative flip)",
          "Har x: temp max/min update with x, max* x, min* x"
      ],
      "solution": "Track both max and min product — sign flip handle. O(n)."
  },
  'array-equilibrium': {
      "problem": "Equilibrium index jahan left sum = right sum.",
      "approach": [
          "Total sum pehle",
          "leftSum build karte jao, rightSum = total - leftSum - arr[i]",
          "leftSum == rightSum → index"
      ],
      "solution": "Prefix idea O(n) one pass after total. O(n) space optional."
  },
  'array-leaders': {
      "problem": "Leaders: right se sab elements se bade/equal.",
      "approach": [
          "Right se scan, maxFromRight track",
          "Agar arr[i] >= maxFromRight → leader, update max"
      ],
      "solution": "Single right-to-left pass O(n)."
  },
  'array-peak': {
      "problem": "Peak element: arr[i] >= neighbors.",
      "approach": [
          "Linear scan compare neighbors",
          "Ya binary search on unsorted-like property"
      ],
      "solution": "Linear O(n). Binary search O(log n) if mountain structure."
  },
  'array-all-peaks': {
      "problem": "Saare peak indices list karo.",
      "approach": [
          "Har i (1..n-2): if arr[i]>arr[i-1] and arr[i]>arr[i+1]: add i"
      ],
      "solution": "Boundary indices check separately. O(n)."
  },
  'array-valley': {
      "problem": "Valley: arr[i] <= neighbors, local minimum.",
      "approach": [
          "Peak ka opposite neighbor check"
      ],
      "solution": "Local min scan O(n)."
  },
  'array-missing-number': {
      "problem": "1..N mein se ek number missing hai array mein.",
      "approach": [
          "Expected sum = n*(n+1)/2",
          "Actual sum subtract → missing",
          "Ya XOR all indices+values"
      ],
      "solution": "Sum formula O(n) O(1). XOR bhi works."
  },
  'array-find-duplicate': {
      "problem": "1..N range mein duplicate kaun sa hai.",
      "approach": [
          "Floyd cycle / mark indices negative / hash set",
          "Sum difference ya XOR"
      ],
      "solution": "Multiple O(n) O(1) tricks — Floyd tortoise for array as linked list."
  },
  'array-two-missing': {
      "problem": "1..N mein do numbers missing.",
      "approach": [
          "Sum aur sum-of-squares equations",
          "Ya mark visited indices"
      ],
      "solution": "Math: two equations two unknowns from total sum and sq sum."
  },
  'array-majority-boyer-moore': {
      "problem": "Majority element (> n/2 times) — Boyer-Moore voting.",
      "approach": [
          "candidate, count=0",
          "Same → count++, different → count--, zero → new candidate",
          "Verify candidate count"
      ],
      "solution": "O(n) time O(1) space voting — cancel pairs."
  },
  'array-stock-single': {
      "problem": "Ek buy ek sell — max profit.",
      "approach": [
          "minPrice track (best buy so far)",
          "Har day: profit = price - minPrice, maxProfit update",
          "price min update"
      ],
      "solution": "One pass O(n) — min so far + max profit."
  },
  'array-stock-multiple': {
      "problem": "Unlimited transactions — max profit.",
      "approach": [
          "Har rise capture: sum (price[i]-price[i-1]) jahan positive",
          "Ya valley-peak pairs add"
      ],
      "solution": "Greedy: har upward slope ka profit jodo. O(n)."
  },
  'array-rearrange-alt-pos-neg': {
      "problem": "Positive negative alternate order mein rearrange.",
      "approach": [
          "Positives aur negatives alag lists",
          "Merge alternate",
          "Ya in-place pointer partition"
      ],
      "solution": "O(n) extra space easy; in-place O(n) two pointer variant."
  },
  'array-zigzag': {
      "problem": "Zig-zag: arr[i] < arr[i+1] > arr[i+2] < … pattern.",
      "approach": [
          "Greedy local swap: if pattern break to fix at i"
      ],
      "solution": "Linear scan fix — O(n) comparisons/swaps."
  },
  'array-dutch-flag': {
      "problem": "Array of 0,1,2 sort in one pass (Dutch National Flag).",
      "approach": [
          "low=0, mid=0, high=n-1",
          "0→low++, 1→mid++, 2→swap high, high--"
      ],
      "solution": "Three pointer partition — O(n) O(1). Dijkstra Dutch flag."
  },
  'array-trapping-rain': {
      "problem": "Bars ke beech kitna pani trap hoga.",
      "approach": [
          "Left max aur right max arrays",
          "Water at i = min(leftMax,rightMax) - arr[i]",
          "Ya two pointer from ends"
      ],
      "solution": "Prefix max both sides O(n) space; two pointer O(1) space O(n) time."
  },
  'array-container-water': {
      "problem": "Do lines choose karke max water container.",
      "approach": [
          "left=0, right=n-1",
          "Area = min(h[l],h[r])*(r-l)",
          "Chhote height wala pointer move karo"
      ],
      "solution": "Two pointer greedy — O(n). Move shorter line inward."
  },
  'array-max-difference': {
      "problem": "Max arr[j]-arr[i] where j>i.",
      "approach": [
          "minSoFar track",
          "Har j: maxDiff = max(maxDiff, arr[j]-minSoFar)",
          "minSoFar update"
      ],
      "solution": "Stock problem jaisa — O(n)."
  },
  'array-smallest-missing-positive': {
      "problem": "Sabse chhota missing positive integer (1,2,3…).",
      "approach": [
          "Cyclic sort: value v ko index v-1 par rakho",
          "Phir scan first wrong index+1"
      ],
      "solution": "Index as hash O(n) O(1) — place each num at correct slot."
  },
  'array-bubble-sort': {
      "problem": "Bubble sort — adjacent swap se sort.",
      "approach": [
          "n passes, har pass mein largest bubble end tak",
          "if arr[j]>arr[j+1] swap",
          "Early exit if no swap"
      ],
      "solution": "O(n²) worst. Stable sort. Learning purpose."
  },
  'array-selection-sort': {
      "problem": "Har step mein unsorted se minimum pick kar front par.",
      "approach": [
          "for i: minIdx find i..n-1, swap arr[i], arr[minIdx]"
      ],
      "solution": "O(n²) comparisons. Unstable swaps version varies."
  },
  'array-insertion-sort': {
      "problem": "Sorted prefix build — naya element sahi jagah insert.",
      "approach": [
          "for i: key=arr[i], j=i-1, shift while arr[j]>key",
          "arr[j+1]=key"
      ],
      "solution": "O(n²) worst, O(n) best sorted. Stable."
  },
  'array-counting-sort': {
      "problem": "0-9 range integers — count array se sort.",
      "approach": [
          "count[10]=0, frequency fill",
          "Phir count se reconstruct array"
      ],
      "solution": "O(n+k) k=range. Non-comparison sort."
  },
  'array-sort-0-1': {
      "problem": "Binary array 0/1 sort one pass.",
      "approach": [
          "Two pointer: 0 front, 1 back swap",
          "Ya count 0s fill front"
      ],
      "solution": "Dutch flag simplified — O(n)."
  },
  'array-sort-0-1-2': {
      "problem": "0,1,2 sort — Dutch flag.",
      "approach": [
          "low, mid, high three pointers",
          "Same as dutch flag algorithm"
      ],
      "solution": "O(n) one pass in-place."
  },
  'array-merge-sorted': {
      "problem": "Do sorted arrays merge ek sorted array mein.",
      "approach": [
          "i, j pointers",
          "Chhota push result, advance pointer",
          "Baaki tail append"
      ],
      "solution": "Merge step of merge sort — O(n+m)."
  },
  'array-single-swap-sortable': {
      "problem": "Kya ek swap se array sorted ho sakti hai?",
      "approach": [
          "Pehle mismatch pair dhundho",
          "Swap karke sorted check",
          "Ya count inversions pattern"
      ],
      "solution": "At most one inverted pair allowed — O(n) scan."
  },
  'array-binary-search': {
      "problem": "Sorted array mein target index dhundho.",
      "approach": [
          "lo=0, hi=n-1",
          "mid=(lo+hi)//2",
          "arr[mid] vs target → half eliminate",
          "lo<=hi repeat"
      ],
      "solution": "O(log n) — har step half search space."
  },
  'array-binary-search-recursive': {
      "problem": "Binary search recursive version.",
      "approach": [
          "Base: lo>hi → -1",
          "mid compute, match return",
          "Recurse left or right half"
      ],
      "solution": "Same logic O(log n), O(log n) stack space."
  },
  'array-bs-first-occurrence': {
      "problem": "Sorted duplicates mein X ka pehla index.",
      "approach": [
          "Binary search: arr[mid]==X par bhi left half search jari",
          "lo track best answer"
      ],
      "solution": "BS variant — match par hi=mid-1. O(log n)."
  },
  'array-bs-last-occurrence': {
      "problem": "X ka last index sorted array mein.",
      "approach": [
          "Match par lo=mid+1, answer save"
      ],
      "solution": "First occurrence ka mirror — right bias."
  },
  'array-bs-count-freq': {
      "problem": "Sorted array mein X ki frequency.",
      "approach": [
          "first = bs_first(X), last = bs_last(X)",
          "count = last - first + 1 (if exists)"
      ],
      "solution": "Do binary searches — O(log n)."
  },
  'array-search-rotated': {
      "problem": "Rotated sorted array mein target search.",
      "approach": [
          "BS: kaun sa half sorted check",
          "Sorted half mein target range check",
          "Eliminate half"
      ],
      "solution": "Modified BS O(log n) — one half always sorted."
  },
  'array-min-rotated': {
      "problem": "Rotated sorted array ka minimum.",
      "approach": [
          "BS: arr[mid] vs arr[hi] — min right half mein",
          "lo, hi narrow"
      ],
      "solution": "O(log n) — compare mid with right end."
  },
  'array-rotation-count': {
      "problem": "Array kitni baar rotate hua (pivot index).",
      "approach": [
          "Min index = rotation count (for sorted rotate)",
          "BS find pivot"
      ],
      "solution": "Pivot index = number of left rotations. O(log n)."
  },
  'array-search-insert': {
      "problem": "Sorted array mein X insert kahan karna hai (index).",
      "approach": [
          "BS: first index jahan arr[i] >= X",
          "Ya lower_bound pattern"
      ],
      "solution": "O(log n) — even if not present return insert pos."
  },
  'array-peak-binary-search': {
      "problem": "Peak element O(log n) binary search se.",
      "approach": [
          "mid compare arr[mid+1]",
          "Uphill → left half mein peak, else right"
      ],
      "solution": "Any peak exists — BS direction by slope. O(log n)."
  },
  'array-sqrt-binary-search': {
      "problem": "N ka integer square root binary search se.",
      "approach": [
          "lo=0, hi=N",
          "mid*mid vs N compare",
          "Answer = largest mid jahan mid*mid<=N"
      ],
      "solution": "BS on answer space O(log N)."
  },
  'array-floor-ceiling': {
      "problem": "Sorted array mein X ka floor aur ceiling.",
      "approach": [
          "BS lower_bound for ceiling",
          "Floor = element before ceiling or exact"
      ],
      "solution": "Two binary searches or one with tracking neighbors."
  },
  'array-count-gt-sorted': {
      "problem": "Sorted array mein kitne > X.",
      "approach": [
          "Upper_bound index = first > X",
          "count = n - upper_bound"
      ],
      "solution": "O(log n) binary search count."
  },
  'array-kth-smallest-bs-answer': {
      "problem": "Kth smallest via binary search on answer range.",
      "approach": [
          "BS on value range min..max",
          "Count elements <= mid",
          "Adjust lo/hi by count vs k"
      ],
      "solution": "Binary search on answer O(n log range)."
  },
  'array-median-two-sorted': {
      "problem": "Do sorted arrays ka median.",
      "approach": [
          "BS on smaller array partition",
          "Left parts <= right parts check",
          "Adjust partition"
      ],
      "solution": "O(log min(m,n)) optimal partition BS."
  },
  'array-longest-consecutive': {
      "problem": "Longest consecutive sequence length (unsorted).",
      "approach": [
          "Set banao",
          "Sirf sequence start (num-1 not in set) se expand",
          "Count length num, num+1…"
      ],
      "solution": "O(n) — har element visited constant times."
  },
  'array-product-except-self': {
      "problem": "Har index par product of all except self — division nahi.",
      "approach": [
          "Prefix products left se, suffix right se",
          "result[i] = left[i]*right[i]"
      ],
      "solution": "Two pass O(n) O(1) extra if output exclude."
  },
  'array-shuffle-fisher-yates': {
      "problem": "Array random shuffle unbiased.",
      "approach": [
          "i = n-1 down to 1",
          "j = random 0..i",
          "swap arr[i], arr[j]"
      ],
      "solution": "Fisher-Yates O(n) — har permutation equally likely."
  },
  'array-next-permutation': {
      "problem": "Lexicographically next permutation.",
      "approach": [
          "Right se pivot jahan arr[i]<arr[i+1]",
          "Swap pivot with next bigger right",
          "Reverse suffix after pivot"
      ],
      "solution": "O(n) — classic STL next_permutation steps."
  },
  'array-previous-permutation': {
      "problem": "Lexicographically previous permutation.",
      "approach": [
          "Pivot jahan arr[i]>arr[i+1]",
          "Swap with previous smaller",
          "Reverse suffix"
      ],
      "solution": "Next permutation ka reverse logic."
  },
  'array-max-xor-subarray': {
      "problem": "Subarray ka maximum XOR value.",
      "approach": [
          "Prefix XOR + binary trie",
          "Har prefix ke liye max xor query trie se"
      ],
      "solution": "Trie O(n * bitlength). Naive O(n²)."
  },
  'array-count-inversions': {
      "problem": "Kitne pairs (i,j) jahan i<j aur arr[i]>arr[j].",
      "approach": [
          "Merge sort count during merge",
          "Left-right cross inversions add"
      ],
      "solution": "Modified merge sort O(n log n)."
  },
  'array-triplets-zero': {
      "problem": "Saare triplets jinka sum 0.",
      "approach": [
          "Sort, fix i, two pointer on rest for sum -arr[i]",
          "Skip duplicates"
      ],
      "solution": "O(n²) after sort O(n log n)."
  },
  'array-lis': {
      "problem": "Longest increasing subsequence length.",
      "approach": [
          "DP: dp[i]=1+max dp[j] j<i, arr[j]<arr[i]",
          "Ya patience sorting O(n log n)"
      ],
      "solution": "O(n²) DP beginner; binary search piles optimal."
  },
  'array-max-circular-subarray': {
      "problem": "Circular array max subarray sum.",
      "approach": [
          "Kadane normal + kadane on inverted (total-sum)",
          "Max of two cases handle all-negative"
      ],
      "solution": "Max subarray OR total - min subarray for circular. O(n)."
  },
  'loops-print-1-to-n': {
      "problem": "1 se N tak numbers print karo.",
      "approach": [
          "for i in range(1, n+1): print(i)"
      ],
      "solution": "Basic counting loop — i har step 1 badhta hai. O(n) iterations."
  },
  'loops-print-n-to-1': {
      "problem": "N se 1 tak reverse print.",
      "approach": [
          "for i in range(n, 0, -1): print(i)"
      ],
      "solution": "Reverse range — start n, step -1."
  },
  'loops-first-n-evens': {
      "problem": "Pehle N even numbers print (2,4,6…).",
      "approach": [
          "i=1 se: even = 2*i print",
          "Ya val=2, har step +2"
      ],
      "solution": "Formula 2*i ya arithmetic progression step 2."
  },
  'loops-divisible-by-5': {
      "problem": "1 se N tak jo 5 se divisible hain print.",
      "approach": [
          "for i in 1..N: if i % 5 == 0: print(i)"
      ],
      "solution": "Modulo filter in loop. O(n)."
  },
  'loops-multiplication-table': {
      "problem": "1 se 10 tak multiplication table.",
      "approach": [
          "Outer i 1..10, inner j 1..10",
          "print(i*j)"
      ],
      "solution": "Nested loop n² prints — pattern Type T."
  },
  'loops-sum-first-n': {
      "problem": "1+2+…+N ka sum.",
      "approach": [
          "Loop accumulate total",
          "Ya formula n*(n+1)/2"
      ],
      "solution": "Loop O(n) ya direct formula O(1)."
  },
  'loops-factorial': {
      "problem": "N! = 1×2×…×N.",
      "approach": [
          "fact=1, for i 1..N: fact*=i",
          "print(fact)"
      ],
      "solution": "Product loop. Overflow for large N."
  },
  'loops-sum-even-odd': {
      "problem": "1..N ka even sum aur odd sum alag.",
      "approach": [
          "Har i: i%2==0 → evenSum else oddSum",
          "Dono print"
      ],
      "solution": "Single loop two accumulators."
  },
  'loops-largest-digit': {
      "problem": "Number ka sabse bada digit.",
      "approach": [
          "while num>0: digit=num%10, max update, num//=10"
      ],
      "solution": "Digit extraction loop Type Q."
  },
  'loops-count-digits': {
      "problem": "Number mein kitne digits.",
      "approach": [
          "count=0, while num>0: count++, num//=10",
          "num=0 edge: 1 digit"
      ],
      "solution": "Peel digits until zero. log10(n) iterations."
  },
  'loops-sum-digits': {
      "problem": "Digits ka sum (digital sum).",
      "approach": [
          "total=0, while num>0: total+=num%10, num//=10"
      ],
      "solution": "Same digit loop, accumulate sum."
  },
  'loops-reverse-number': {
      "problem": "Number ulta likho (reverse digits).",
      "approach": [
          "rev=0, while num>0: rev=rev*10+num%10, num//=10"
      ],
      "solution": "Build reversed number digit by digit."
  },
  'loops-check-prime': {
      "problem": "Kya N prime hai?",
      "approach": [
          "if n<2 False",
          "i=2 se sqrt(n): if n%i==0 False",
          "True"
      ],
      "solution": "Trial division O(sqrt n)."
  },
  'loops-print-factors': {
      "problem": "N ke saare factors print.",
      "approach": [
          "i=1 se sqrt(N): if N%i==0 print i and N/i"
      ],
      "solution": "Pair factors O(sqrt n). Duplicates for perfect square."
  },
  'loops-gcd': {
      "problem": "GCD(a,b) Euclidean algorithm.",
      "approach": [
          "while b!=0: a,b = b, a%b",
          "a = GCD"
      ],
      "solution": "Euclid O(log min(a,b)). Recursive same."
  },
  'loops-lcm': {
      "problem": "LCM(a,b) = a*b/GCD.",
      "approach": [
          "Pehle gcd nikalo",
          "lcm = a // gcd * b (overflow safe order)"
      ],
      "solution": "GCD ke baad formula. O(log)."
  },
  'loops-fibonacci': {
      "problem": "Fibonacci ke pehle N terms.",
      "approach": [
          "a=0,b=1",
          "N terms: print a, phir a,b = b, a+b shift"
      ],
      "solution": "Two variable iteration — O(n) terms."
  },
  'loops-tribonacci': {
      "problem": "Tribonacci: har term = pichhle 3 ka sum.",
      "approach": [
          "a,b,c seed",
          "Next = a+b+c, slide window"
      ],
      "solution": "Three variable shift — O(n)."
  },
  'loops-right-triangle-numbers': {
      "problem": "Number triangle: row i mein 1..i.",
      "approach": [
          "Outer row 1..n",
          "Inner col 1..row: print col"
      ],
      "solution": "Nested loops Type T — row controls inner limit."
  },
  'loops-inverted-triangle-numbers': {
      "problem": "Ulta number triangle.",
      "approach": [
          "Row i: print 1..(n-i+1) ya n-row+1 down"
      ],
      "solution": "Outer row, shrinking inner range."
  },
  'loops-centered-pyramid-numbers': {
      "problem": "Centered number pyramid.",
      "approach": [
          "Har row: spaces phir numbers",
          "Padding calculate from row and n"
      ],
      "solution": "Spaces + numbers nested logic Type T."
  },
  'loops-hollow-square-numbers': {
      "problem": "Hollow square numbers se.",
      "approach": [
          "Border par number, andar space",
          "if first/last row or col print else space"
      ],
      "solution": "Nested loop boundary condition."
  },
  'loops-diamond-numbers': {
      "problem": "Number diamond shape.",
      "approach": [
          "Upper half pyramid + lower inverted",
          "Row width pattern"
      ],
      "solution": "Two phase nested loops."
  },
  'loops-right-triangle-stars': {
      "problem": "Star right triangle.",
      "approach": [
          "Row i: i stars print",
          "Outer row, inner star count"
      ],
      "solution": "Classic pattern — inner loop i times."
  },
  'loops-centered-pyramid-stars': {
      "problem": "Centered star pyramid.",
      "approach": [
          "Spaces then stars 2*i-1 per row"
      ],
      "solution": "Padding + odd star count per row."
  },
  'loops-hollow-square-stars': {
      "problem": "Hollow star square.",
      "approach": [
          "Border star, interior space",
          "Row/col edge check"
      ],
      "solution": "Nested if for boundaries."
  },
  'loops-diamond-stars': {
      "problem": "Star diamond.",
      "approach": [
          "Upper triangle + lower inverted triangle stars"
      ],
      "solution": "Two halves row loop."
  },
};

export function getAlgorithmForId(id: string): AlgoBlock | undefined {
  return ALGORITHM_BY_ID[id];
}
