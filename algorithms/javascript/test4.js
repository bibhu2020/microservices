// Find binary gap
function solution(N) {
    const binary = N.toString(2);
    console.log(`Binary representation: ${binary}`);
    
    let maxGap = 0;
    const gaps = binary.split("1");

    // If the binary number ends with 0, the last split part is invalid for a gap
    for (let i = 0; i < gaps.length - 1; i++) {
        maxGap = Math.max(maxGap, gaps[i].length);
    }

    if (maxGap === 0) {
        console.log("No binary gap found");
    }

    return maxGap;
}

// Test cases
console.log(solution(15)); // Example: 15 in binary is 1111, no gap
console.log(solution(529)); // Example: 529 in binary is 1000010001, max gap is 4
console.log(solution(1041)); // Example: 20 in binary is 10100, max gap is 1