function solution1(A,X) {
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

function solution2(A,B) {
    if(A.length !== B.length) {
        return false; // Arrays are not equal in length
    }
    // Sort and compare as JSON strings
    return JSON.stringify(A.sort()) === JSON.stringify(B.sort());
}

function solution3(A,B) {
    if(A.length !== B.length) {
        return false; // Arrays are not equal in length
    }
    // Sort and compare as JSON strings
    return JSON.stringify(A.sort()) === JSON.stringify(B.sort());
}

//console.log(solution([1,2,5,1,1,2,3,5,1], 5));

// Equate 2 Arrays
console.log(solution2([1,2,5,1,1,2,3,5,1], [1,2,5,1,1,2,3,5,1]));

