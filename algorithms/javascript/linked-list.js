class Node {
    constructor(value) {
        this.value = value; // Stores the data
        this.next = null;   // Points to the next node
    }
}

class LinkedList {
    constructor() {
        this.head = null; // Head of the list
    }

    // Insert at the end
    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }

    // Insert at the beginning
    prepend(value) {
        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
    }

    // Search for a value
    search(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) return true;
            current = current.next;
        }
        return false;
    }

    // Delete a node by value
    delete(value) {
        if (!this.head) return;

        // If the head needs to be deleted
        if (this.head.value === value) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next && current.next.value !== value) {
            current = current.next;
        }

        if (current.next) {
            current.next = current.next.next;
        }
    }

    // Print the linked list
    print() {
        let current = this.head;
        let result = "";
        while (current) {
            result += `${current.value} -> `;
            current = current.next;
        }
        console.log(result + "null");
    }
}

// Example Usage
const list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);
list.prepend(5);
list.print(); // Output: 5 -> 10 -> 20 -> 30 -> null
console.log(list.search(20)); // Output: true
list.delete(10);
list.print(); // Output: 5 -> 20 -> 30 -> null
