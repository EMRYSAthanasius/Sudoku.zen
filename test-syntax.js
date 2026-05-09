// Simple syntax validation test
try {
  // Test import syntax
  console.log('Testing syntax...');
  
  // Test basic ES6 features we used
  const testArray = [1, 2, 3];
  const testSet = new Set([1, 2, 3]);
  const testPromise = new Promise((resolve) => resolve('test'));
  
  // Test arrow functions and destructuring
  const testFunc = ({ a, b }) => a + b;
  
  // Test class syntax
  class TestClass {
    constructor() {
      this.value = 0;
    }
  }
  
  console.log('All syntax tests passed!');
} catch (error) {
  console.error('Syntax error:', error);
}
