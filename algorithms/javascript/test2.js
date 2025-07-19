function solution(str) {
    length = str.length;
    if (length % 2 == 0){ //no character exists that devides the string into two equal parts
        //even
        return -1;
    }
    // console.log(parseInt(str.length / 2));
    index = parseInt(str.length / 2); //index of the middle character
    // console.log(index);

    str1 = str.substring(0, index);
    str2 = str.substring(index + 1, length); 
    
    str3 = str2.split("").reverse().join("");
    if (str1 == str3){
        return index;
    }
    

    return -1;
}

console.log(solution("racecar"));
console.log(solution("abcdedcba"));
console.log(solution("raccar"));