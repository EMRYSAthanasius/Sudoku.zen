const { performance } = require('perf_hooks');

const bench = () => {
  const nextB = new Array(81).fill(1); // all filled for max counting
  const r = 4;
  const c = 4;
  const br = Math.floor(r / 3);
  const bc = Math.floor(c / 3);

  const start1 = performance.now();
  let total1 = 0;
  for (let iter = 0; iter < 1000000; iter++) {
    const seenIdx = new Set();
    let preFilledCount = -1;
    for (let i = 0; i < 9; i++) {
      const rIdx = r * 9 + i;
      const cIdx = i * 9 + c;
      const boxIdx = (br * 3 + Math.floor(i / 3)) * 9 + (bc * 3 + (i % 3));
      if (!seenIdx.has(rIdx) && nextB[rIdx] !== 0) { seenIdx.add(rIdx); preFilledCount++; }
      if (!seenIdx.has(cIdx) && nextB[cIdx] !== 0) { seenIdx.add(cIdx); preFilledCount++; }
      if (!seenIdx.has(boxIdx) && nextB[boxIdx] !== 0) { seenIdx.add(boxIdx); preFilledCount++; }
    }
    total1 += preFilledCount;
  }
  const end1 = performance.now();

  const start2 = performance.now();
  let total2 = 0;
  for (let iter = 0; iter < 1000000; iter++) {
    let preFilledCount = -1;
    for (let i = 0; i < 9; i++) {
      if (nextB[r * 9 + i] !== 0) preFilledCount++;
      if (i !== r && nextB[i * 9 + c] !== 0) preFilledCount++;
      const r_box = br * 3 + Math.floor(i / 3);
      const c_box = bc * 3 + (i % 3);
      if (r_box !== r && c_box !== c && nextB[r_box * 9 + c_box] !== 0) preFilledCount++;
    }
    total2 += preFilledCount;
  }
  const end2 = performance.now();

  console.log('Set approach:', end1 - start1, 'ms, total:', total1);
  console.log('Optimized single loop:', end2 - start2, 'ms, total:', total2);
}
bench();
