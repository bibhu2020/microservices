function solution(A,X) {
    let freqMap = new Map();
    for(let num of A) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    let calArray = A.filter(num => freqMap.get(num) > 1);
    let setArrary = new Set(calArray);
    

    A = Array.from(setArrary);
    

    let ret = new Map();
    for(i=0; i< A.length; i++){
        for(j=0; j<A.length; j++){
            sum = A[i] + A[j];
            mul = A[i] * A[j];
            if(mul >= X && A[i] != A[j] && !ret.has(sum)){
                ret.set(sum, mul);
            }
        }
    }

    if(ret.size > 1000000000n)
        return -1;
    
    return ret.size;

    // return -1;
}

console.log(solution([1,2,5,1,1,2,3,5,1], 5));
