function solution(arr){

    retArry = [];

    arr.forEach((value, index) => {

        for (let i = 0; i < arr.length; i++) {
            //console.log(`Index: ${i}, Value: ${arr[i]}`);
            if (i > index && arr[i] < value){
                retArry.push([index, i]);
            }
        }
    });

    if (retArry.length > 1000000000n){
        return -1;
    }
    else{
        return retArry.length;
    }
}

console.log(solution([-1,6,3,4,7,4]));