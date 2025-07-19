# Data Structures
- Arrays
- Set
- Map
- Object
- Linked List
- HashMaps
- Stacks & Queues
- Trees
- Graphs

## Arrays
Is the simplest data structure and easy for reading data. But, Insert/Delete could be inefficient with Array. This is because the array elements/nodes are sitting next to each other in Memory. When you insert an element in between, the array elements need to shift. Hence, this is not memory efficient.

## Linked List
Insert / Delete operation is efficient in a linked list, but not read opeations. Each node stores the data and a pointer to the next node memory.

## HashMaps


# Algorithms

## Linear Search
Let's say you have to search a specific number in the list. In linear search, you traverse from begining and keep matching the number from the list.
```python
def linear_search(arr, target):
    for i in range(len(arr)):  # Traverse through the list
        if arr[i] == target:   # Check if the element matches the target
            return i           # Return the index of the found element
    return -1  # Return -1 if not found
```
**Challenges**:
- It' is an efficient approach for a long list. if there are 1,000,000 elements, it may have to check all of them in the worst case.

## Binary Search
Binary search is an efficient searching algorithm used to find an element in a **sorted** list. It works by repeatedly dividing the search range in half, eliminating half of the elements at each step.
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1  # Define the search range

    while left <= right:
        mid = (left + right) // 2  # Find the middle index

        if arr[mid] == target:
            return mid  # Element found
        elif arr[mid] < target:
            left = mid + 1  # Search in the right half
        else:
            right = mid - 1  # Search in the left half

    return -1  # Element not found
```
It's an efficient way to search in large list, but the list must be sorted first.

## Depth-First Search (DFS)


## Breadth-First Search

## Insertion Sort

## Merge Sort

## Quick Sort

## Greedy Algorithm