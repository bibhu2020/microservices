function findPosition(arr){
    lengthOfArr = arr.length;
    lengthofSet = (new Set(arr)).size;
    retValue = 0

    if (lengthOfArr == lengthofSet){
        //there is no duplicate 
        retValue =  -1;
    }
    else{
        let map = new Map();
        arr.forEach(element => {
            key = element;
            map.set(key, map.get(key) + 1 || 1);
        }); //capture each number and its count.

        // //find the last element with count 1
        // lastUniqueNumber = 0;
        // arr.forEach(element => {
        //     key = element;
        //     if(map.get(key) == 1){
        //         lastUniqueNumber = key;
        //     }
        // });
        // console.log(lastUniqueNumber);
        // retValue = arr.indexOf(lastUniqueNumber)

        firstUniqueNumber = -1;
        arr.forEach(element => {
            key = element;
            if(map.get(key) == 1 && firstUniqueNumber == -1){
                firstUniqueNumber = key;
            }
        });
        // console.log(firstUniqueNumber);
        retValue = firstUniqueNumber;

    }
    return retValue;
}



console.log(findPosition([4, 10, 5, 4, 2, 10]));

console.log(findPosition([1, 4, 3, 3, 1, 2]));

console.log(findPosition([6, 4, 4, 6]));
