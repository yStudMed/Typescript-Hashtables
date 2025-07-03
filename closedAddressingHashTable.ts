class LinkedList {
    public head: LinkedListNode | null = null;
    public tail: LinkedListNode | null = null;
    #begin(): LinkedListIterator {
        let itr: LinkedListIterator = new LinkedListIterator(this.head);
        return itr;
    };
    public find(key: string): LinkedListNode | null {
        for (let itr = this.#begin(); itr.currentNode !== null; itr.next()) {
            if (key === itr.currentNode.key) {
                return itr.currentNode;
            };
        };
        return null;
    };
    public addOrUpdate(key: string, value: any): void {
        let newNode: LinkedListNode = new LinkedListNode(key, value);
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            let node: LinkedListNode | null = this.find(key);
            if (node === null) {
                newNode.next = this.head;
                this.head.back = newNode;
                this.head = newNode;
            } else {
                node.value = value;
            };
        };
    };
    public delete(key: string): boolean {
        let node: LinkedListNode | null = this.find(key);
        if (node === null) {
            return false;
        };
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        } else if (node === this.head) {
            node.next!.back = null;
            this.head = node.next;
        } else if (node === this.tail) {
            node.back!.next = null;
            this.tail = node.back;
        } else {
            node.back!.next = node.next;
            node.next!.back = node.back;
        };
        return true;
    };
};

class LinkedListNode {
    public next: LinkedListNode | null = null;
    public back: LinkedListNode | null = null;
    constructor(public key: string, public value: any) { };
};

class LinkedListIterator {
    public currentNode: LinkedListNode | null = null;
    constructor(node: LinkedListNode | null) {
        this.currentNode = node;
    };
    public next(): LinkedListIterator {
        if (this.currentNode === null) {
            return this;
        };
        this.currentNode = this.currentNode.next;
        return this;
    };
};


class HashTable {
    #table: LinkedList[] = new Array(7 /*fixed size*/);
    #hash(key: string): number {
        let hash: number = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        };
        return hash % this.#table.length;
    };
    public set(key: string, value: any): void {
        let index: number = this.#hash(key);
        if (this.#table[index] === undefined) {
            let linkedList: LinkedList = new LinkedList();
            this.#table[index] = linkedList;
        };
        this.#table[index].addOrUpdate(key, value);
    };
    public get(key: string): any {
        let index: number = this.#hash(key);
        if (this.#table[index] === undefined) {
            return;
        };
        let node: LinkedListNode | null = this.#table[index].find(key);
        if (node) {
            return node.value;
        };
    };
    public remove(key: string): boolean {
        let index: number = this.#hash(key);
        if (this.#table[index] === undefined) {
            return false;
        };
        let deleted: boolean = this.#table[index].delete(key);
        if (this.#table[index].head === null) {
            delete this.#table[index];
        };
        return deleted;
    };
    ///
    public get enteriesArray(): LinkedList[] {
        return this.#table;
    };
};


const hashtable: HashTable = new HashTable();

hashtable.set("alaa", 66);
hashtable.set("youssef", 16);
hashtable.set("adham", 46);
hashtable.set("tariq", 36);
hashtable.set("sabry", 21);
// test
hashtable.set("sameh", 64);
hashtable.remove("sameh");
hashtable.set("sameh", 44);
//
hashtable.set("ahmed", 34);
// hashtable.remove("ahmed");
hashtable.remove("alaa");

// hashtable.set("ahmed", 50);

console.log(hashtable.get("ahmed"));