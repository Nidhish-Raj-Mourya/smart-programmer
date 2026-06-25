import type { ProblemApproach } from '../../engine/types';

const MANIPULATION: Record<string, ProblemApproach> = {
  'array-insert-at': {
    what: 'Array mein kisi position par naya element daalna — pehle jagah banao (shift right), phir value rakho.',
    variables: ['arr', 'pos (index)', 'val (new value)', 'i (loop counter)'],
    steps: [
      'Array ka size 1 badhao (mentally ya n+1 length).',
      'pos se last tak — har element ko ek index RIGHT shift karo (peeche se aage loop).',
      'pos par khali slot bachti hai.',
      'arr[pos] = val set karo.',
    ],
    tip: 'Right se left loop isliye — warna values overwrite ho jati hain!',
  },
  'array-delete-at': {
    what: 'Kisi index ka element hatao — uske baad ke sab elements LEFT shift karke gap band karo.',
    variables: ['arr', 'pos (index to delete)', 'i (loop counter)'],
    steps: [
      'Jo element arr[pos] par hai — use remove karna hai.',
      'pos se end tak — har element ko ek slot LEFT shift karo (arr[i] = arr[i+1]).',
      'Last element duplicate ho jata hai — array ka size 1 kam karo.',
    ],
    tip: 'Left shift = i ko pos se n-2 tak chalao, arr[i+1] ko arr[i] mein copy karo.',
  },
  'array-insert-sorted': {
    what: 'Sorted array mein nayi value sahi jagah insert karo — pehle position dhundo, phir shift + insert.',
    variables: ['arr (sorted)', 'val', 'i', 'pos'],
    steps: [
      'Left se scan — jahan arr[i] > val, wahi insert position hai.',
      'Agar sab chhote hain to end mein insert.',
      'buildInsertAt jaisa shift-right + insert.',
    ],
    tip: 'Sorted array mein linear scan OK hai beginners ke liye; binary search advanced hai.',
  },
  'array-reverse-inplace': {
    what: 'Array ko ulta karo bina extra array ke — start aur end swap karte jao.',
    variables: ['arr', 'left', 'right'],
    steps: [
      'left = 0, right = last index.',
      'Jab tak left < right: swap arr[left] aur arr[right].',
      'left++, right--.',
    ],
    tip: 'Two pointers meet in the middle — O(n) time, O(1) extra space.',
  },
  'array-move-zeros-end': {
    what: 'Saare 0 end mein, non-zero order same — slow/fast pointer se compact karo.',
    variables: ['arr', 'slow', 'fast'],
    steps: [
      'slow = next non-zero likhne ki jagah.',
      'fast har element scan karta hai.',
      'Non-zero mile to arr[slow] = arr[fast], slow++.',
    ],
    tip: 'Ye same-direction two pointer pattern hai — bahut common!',
  },
};

const LEVEL1: Record<string, ProblemApproach> = {
  'array-sum': {
    what: 'Array ke saare numbers ka total nikalna.',
    variables: ['arr', 'total = 0', 'i'],
    steps: ['total = 0 se start', 'Har i par total += arr[i]', 'End mein total print'],
    tip: 'Accumulator pattern — har step par running sum dikhta hai.',
  },
  'array-linear-search': {
    what: 'Target value array mein kahan hai — har element check karo.',
    variables: ['arr', 'x (target)', 'i'],
    steps: ['i = 0 se start', 'Agar arr[i] == x → index return', 'Nahi mila to i++', 'Poora scan → -1'],
    tip: 'Match milte hi ruk jao — early exit.',
  },
};

export const ARRAY_APPROACHES: Record<string, ProblemApproach> = {
  ...MANIPULATION,
  ...LEVEL1,
};

export function getArrayApproach(id: string, title: string, keys: string[], movementType: string): ProblemApproach {
  return (
    ARRAY_APPROACHES[id] ?? {
      what: `${title} — visualization se dekho data structure par kya ho raha hai.`,
      variables: keys.map((k) => (k === 'arr' ? 'arr (array)' : k)),
      steps: [
        'Input fields mein values do → Run simulation dabao.',
        'Yellow pointers batate hain ab kaunsa index active hai.',
        'Watch panel mein variables live update hote hain.',
        'Code panel mein highlighted line = ab yeh line chal rahi hai (debugger jaisa).',
      ],
      tip: `Movement type ${movementType} — similar problems same visual pattern reuse karti hain.`,
    }
  );
}
