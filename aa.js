function solution(A) {
    // write your code in JavaScript (Node.js 8.9.4)
    
    A.sort((a,b) => a > b ? 1 : -1);
    let last = A[A.length-1];
    console.log(last);
    if (last < 0) return 1;
    let counter = 1;

   for(let j = 0; j < last; j++){
        for(let i = 0; i < last; i++) {
            console.log(last);
            if (A[j] === counter) {
                counter++;
            }
        }
       
   }
return counter;
}
let x = [1, 3, 6, 4, 1, 2];

console.log(solution(x));