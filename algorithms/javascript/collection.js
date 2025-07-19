// Array of fruits
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.push("Kiwi");
fruits.push("Orange");
fruits.push("Orange");
fruits.push("Banana");
//console.log(fruits); // ["Banana", "Orange", "Apple", "Mango", "Kiwi"]

fruits.sort();

//const max = Math.max(...A);
//A.sort((a,b) => a - b);
//A.includes(i))

fruits.forEach(element => {
    console.log(element);       
});

var numbers = [4, 2, 5, 1, 3, 5, 3, 9, 7, 4, 2];
// numbers.sort(function(a, b) {
//     return a - b;
// });
numbers.sort((a,b) => b-a);
console.log(numbers); // [1, 2, 3, 4, 5]

///////////////////////////////////////////////////////////////////////////////////////
//Set
let numberSet = new Set(numbers); //Convert Array to an Set to remove duplicates
console.log(numberSet);

//Convert set to array
let numberArray = Array.from(numberSet); // Convert Set back to Array
console.log(numberArray);

///////////////////////////////////////////////////////////////////////////////////////
//Object
let person = { name: "Alice", age: 30 };
console.log(person.name);  // Alice
person.age = 31;  // Update the age
console.log(person);  // { name: "Alice", age: 31 }

///////////////////////////////////////////////////////////////////////////////////////
//Map - Key Value Pair
let map = new Map();
map.set('name', 'Bob');
map.set('age', 25);
console.log(map.get('name'));  // Bob
console.log(map.has('age'));   // true
map.delete('age');
console.log(map);  // Map { 'name' => 'Bob' }

// Map of Fruits and Count
let fruitCount = new Map();
fruits.forEach(fruit => {
    if (fruitCount.has(fruit)) {
        fruitCount.set(fruit, fruitCount.get(fruit) + 1);
    } else {
        fruitCount.set(fruit, 1);
    }
});
console.log (fruitCount);

// Example Map with keys and their respective counts
let map2 = new Map([
    ['apple', 5],
    ['banana', 3],
    ['orange', 7],
    ['grape', 2]
]);
console.log(map2.size);  // 4

// Step 1: Convert Map to an array of key-value pairs
let sortedArray = Array.from(map2.entries());
// Step 2: Sort the array based on the counts (values)
sortedArray.sort((a, b) => b[1] - a[1]);  // Sorting in descending order based on count
// Step 3: Convert the sorted array back into a Map
let sortedMap = new Map(sortedArray);

console.log(sortedMap);

/// using map on Array
const fruits = ["apple", "banana", "cherry"];

const uppercasedFruits = fruits.map(fruit => fruit.toUpperCase());

console.log(uppercasedFruits); // ["APPLE", "BANANA", "CHERRY"]