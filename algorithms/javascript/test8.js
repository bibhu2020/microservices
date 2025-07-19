/// Find 2 numbers in an array that sums up to target
function solution1(A, target){

    let retArray = []; // This will store the result if needed, but in this case we return directly from the loop

    let numMap = new Map();
    for (i=0, len=A.length; i<len; i++){
        numMap.set(A[i], i); // Store the index of each number in the map
    }

    for (i=0, len=A.length; i<len; i++){
        const val = target - A[i]; // Calculate the complement that would sum to target
        if(numMap.has(val)){
            const index = numMap.get(val); 
            if(index !== i){
                retArray.push([i, index]); // Return the pair of indices that sum to target
            }
        }
    }

    return retArray;

}

///Find the longest consecutive sequence in an array of integers
function solution2(A){
    
    let retArray = []; 

    if(A.length === 0) return 0;

    let numSet = new Set(A); // removes duplicates
    let sortedArray = Array.from(numSet).sort((a,b) => a-b); // numbers sorted in ascending order

    let numMap = new Map();
    for(i=0; i<sortedArray.length; i++){
        numMap.set(sortedArray[i], i); // store each number with its index
    }

    //console.log(numMap);

    let tmp = [];
    for(i=0; i<sortedArray.length; i++){
        if(tmp.length == 0)
        {
            tmp.push(sortedArray[i]); // Start new sequence with the first element
        }
        else {
            if(numMap.has(sortedArray[i] - 1)) {
                // if the previous number exists in the map, continue the sequence
                tmp.push(sortedArray[i]);
            }
            else {
                retArray.push(tmp);
                tmp = []; //empty the array
            }
        }
    }

    if (retArray.length > 0){
        // find the longest sequence in retArray
        let longest = retArray.reduce((a, b) => a.length > b.length ? a : b);
        return longest; // return the length of the longest consecutive sequence
    }
    return retArray;
}

//find k frequent elements in an array
function solution3(A, k){
    let sortedArray = A.sort((a,b) => a-b); // sort the array first to get the frequency in order
    let freqMap = new Map();
    for(i=0; i<sortedArray.length; i++){
        freqMap.has(sortedArray[i]) ? freqMap.set(sortedArray[i], freqMap.get(sortedArray[i]) + 1) :
                                        freqMap.set(sortedArray[i], 1); // initialize frequency count for each number in the array
    }

    //created sorted 2-dimensional array by descending order
    sortedArray = [...freqMap].sort((a,b) => b[1] - a[1]);

    let retArray = [];
    for(i=0; i<k; i++){
        if(sortedArray[i] && sortedArray[i][0] !== undefined){
            retArray.push(sortedArray[i][0]); // push the number itself, not the frequency
        }
    }

    return retArray;
}

console.log(solution1([1,2,5,1,1,2,3,5,1], 5)); // Expected output: [2,3] or [1,4] etc. depending on the array and target sum

console.log(solution2([100, 4, 200, 1, 3, 2, 4, 7, 5])); // Expected output: 4 (the longest consecutive sequence is [1, 2, 3, 4])

console.log(solution3([3,1,2,2,1,3,5,5,6, 3, 5, 8],2)); 
