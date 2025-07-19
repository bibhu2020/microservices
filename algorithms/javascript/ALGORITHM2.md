## Big O Notations
Big O notation is a mathematical way to describe how the runtime (or space) of an algorithm grows as the input size increases. It helps developers understand the efficiency of an algorithm and compare different solutions.

## O(1)
means constant time. The runtime does not change with input size. E.g. Accessing an Element from an Array. arr[i]

## O(log n)
means Logarithmic Time. The runtime grows slowly as input increases (divides problem in half). E.g. Binary search

## O(n)
means Linear Time. The runtime grows proportionally with input size. E.g. Looping through an array

## O(n log n)
Log-Linear Time. Faster than O(n²) but slower than O(n). E.g. Merge Sort, QuickSort (average case)

## O(n²)
Quadratic Time. Nested loops; performance drops significantly with large inputs. Bubble Sort, Selection Sort

## O(2ⁿ)
Exponential Time. Growth doubles with each increase in input size. E.g. Recursive Fibonacci

## O(n!)
Factorial Time. The slowest, very inefficient for large inputs. Traveling Salesman Problem (Brute Force)