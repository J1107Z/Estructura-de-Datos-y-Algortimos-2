// ==========================================
// 1. REGULAR FUNCTION
// ==========================================

function checkOddOrEvenRegular(num) {
  const isEven = num % 2 === 0;
  const result = isEven ? 'even' : 'odd';
  console.log(`[Regular Function] The number ${num} is ${result}`);
  return result;
}

// ==========================================
// 2. ARROW FUNCTION
// ==========================================

const checkOddOrEvenArrow = (num) => {
  const isEven = num % 2 === 0;
  const result = isEven ? 'even' : 'odd';
  console.log(`[Arrow Function] The number ${num} is ${result}`);
  return result;
};

// ==========================================
// 3. EJECUCIÓN Y PRUEBAS EN CONSOLA
// ==========================================
console.log('=== 01-CHALLENGE: REGULAR VS ARROW FUNCTIONS ===\n');

console.log('--- Probando con Regular Function ---');
checkOddOrEvenRegular(4);  // Even
checkOddOrEvenRegular(7);  // Odd
checkOddOrEvenRegular(0);  // Even
checkOddOrEvenRegular(-3); // Odd

console.log('\n--- Probando con Arrow Function ---');
checkOddOrEvenArrow(10); // Even
checkOddOrEvenArrow(15); // Odd
checkOddOrEvenArrow(22); // Even
checkOddOrEvenArrow(-8); // Even

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkOddOrEvenRegular, checkOddOrEvenArrow };
}
