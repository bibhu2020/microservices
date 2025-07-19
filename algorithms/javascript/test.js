
function sorting(array, k){
    //sort the nails by length in descending order
    let sortedArray = array.sort((a, b) => b - a);

    let map = new Map();

    array.forEach(element => {
        // key = "NailSize#" + element;
        key = element;
        map.set(key, map.get(key) + 1 || 1);
    });

    let sortedMapArray = Array.from(map.entries());
    sortedMapArray.sort((a, b) => b[1] - a[1]);

    sortedMap = new Map(sortedMapArray);

    console.log(sortedMap);

    lengthToBeHammered = 0; // 0 means not found yet
    retValue = 0
    sortedMap.forEach((value, key) => {
        //console.log(value);
        if(value >= k && lengthToBeHammered == 0){
            lengthToBeHammered = value;
            console.log("Length to be hammered down: " + key);
        }
        else if (lengthToBeHammered > 0 && retValue == 0){
            console.log("Length to be matched: " + key);
            retValue =  value + k;
        }
    });
    return retValue;

}

console.log(sorting([1,1,3,3,3,3,4,8,5,7,7,7,5,5], 3)); 