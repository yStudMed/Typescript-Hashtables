class KeyValuePair {
    #key: string;
    public tombstone: boolean = false;
    constructor(key: string, public value: any) {
        this.#key = key;
    };
    public get key(): string {
        return this.#key;
    };
};

class OpenAddressingHashTable {
    #primeNumbers: number[] = [11, 17, 23, 31, 41, 47, 59, 67, 73, 83, 97, 103, 109,
        127, 137, 149, 157, 167, 179, 191, 197, 211, 227, 233, 241, 257, 269, 277, 283, 307,
        313, 331, 347, 353, 367, 379, 389, 401, 419, 431, 439, 449, 461, 467, 487, 499, 509,
        523, 547, 563, 571, 587, 599, 607, 617, 631, 643, 653, 661, 677, 691, 709, 727, 739,
        751, 761, 773, 797, 811, 823, 829, 853, 859, 877, 883, 907, 919, 937, 947, 967, 977,
        991, 1009, 1019, 1031, 1039, 1051, 1063, 1087, 1093, 1103, 1117, 1129, 1153, 1171, 1187, 1201, 1217
    ];
    #currentIndex: number = 0;
    #entriesCount: number = 0;
    #table: KeyValuePair[] = new Array(this.#primeNumbers[this.#currentIndex]);
    #hash(key: string): number {
        let hash: number = 0;
        for (let i = 0; i < key.length; i++) {
            hash += key.charCodeAt(i);
        };
        return hash % this.#table.length;
    };
    #collisionHandling(key: string, hash: number, set: boolean): number {
        let newHash: number = 0;
        let tombstonesCount: number = 0;
        let indexOfFirstTombstone: number = -1;
        for (let i = 1; i < this.#table.length; i++) {
            newHash = (hash + i) % this.#table.length;
            if (set) {
                if (this.#table[newHash] === undefined) {
                    if (tombstonesCount === 0) {
                        return newHash;
                    } else {
                        return indexOfFirstTombstone;
                    };
                };
                if (this.#table[newHash].key === key) {
                    if (tombstonesCount === 0) {
                        return newHash;
                    } else {
                        this.#table[newHash].tombstone = true;
                        return indexOfFirstTombstone;
                    };
                };
                if (this.#table[newHash].tombstone === true) {
                    tombstonesCount++;
                    if (tombstonesCount === 1) {
                        indexOfFirstTombstone = newHash;
                    };
                };
            };
            if (!set) {
                if (this.#table[newHash] === undefined) {
                    return -1;
                };
                if (this.#table[newHash].key === key && this.#table[newHash].tombstone === false) {
                    return newHash;
                };
            };
        };
        return indexOfFirstTombstone;
    };
    #resize(): void {
        let newSize = this.#primeNumbers[++this.#currentIndex];
        if (newSize === undefined) {
            newSize = this.#table.length + 13;
        };
        //
        console.log("Resized from: " + this.#table.length + " to " + newSize);
        //
        let tableCopy: KeyValuePair[] = this.#table;
        this.#table = new Array(newSize);
        this.#entriesCount = 0;
        for (let i = 0; i < tableCopy.length; i++) {
            this.set(tableCopy[i].key, tableCopy[i].value);
        };
    };
    public set(key: string, value: any): void {
        let index: number = this.#hash(key);
        let newPair: KeyValuePair = new KeyValuePair(key, value);
        if (this.#table[index] === undefined) {
            this.#table[index] = newPair;
            this.#entriesCount++;
        } else if (this.#table[index].key === key) {
            this.#table[index].value = value;
            this.#table[index].tombstone = false;
        } else {
            let newIndex: number = this.#collisionHandling(key, index, true);
            if (newIndex === -1) {
                this.#resize();
                let index: number = this.#hash(key);
                if (this.#table[index] === undefined) {
                    this.#table[index] = newPair;
                    this.#entriesCount++;
                } else {
                    let newIndex: number = this.#collisionHandling(key, index, true);
                    this.#table[newIndex] = newPair;
                    this.#entriesCount++;
                };
            } else if (this.#table[newIndex] === undefined) {
                this.#table[newIndex] = newPair;
                this.#entriesCount++;
            } else if (this.#table[newIndex].key === key) {
                this.#table[newIndex].value = value;
                this.#table[newIndex].tombstone = false;
            } else {
                this.#table[newIndex] = newPair;
            };
        };
    };
    public get(key: string): any {
        let index: number = this.#hash(key);
        if (this.#table[index] === undefined) {
            return;
        };
        if (this.#table[index].key === key) {
            if (this.#table[index].tombstone === true) {
                return;
            } else {
                return this.#table[index].value;
            };
        } else {
            let newIndex: number = this.#collisionHandling(key, index, false);
            if (newIndex === -1) {
                return;
            } else {
                return this.#table[newIndex].value;
            };
        };
    };
    public remove(key: string): boolean {
        let index: number = this.#hash(key);
        if (this.#table[index] === undefined) {
            return false;
        } else if (this.#table[index].key === key) {
            if (this.#table[index].tombstone === true) {
                return false;
            } else {
                this.#table[index].tombstone = true;
                return true;
            };
        } else {
            let newIndex: number = this.#collisionHandling(key, index, false);
            if (newIndex === -1) {
                return false;
            };
            this.#table[newIndex].tombstone = true;
            return true;
        };
    };
    public get entriesArray(): KeyValuePair[] {
        return this.#table;
    };
};


const openAddressingHashtable: OpenAddressingHashTable = new OpenAddressingHashTable();


openAddressingHashtable.set("mostafa", 24);
openAddressingHashtable.set("mahmoud", 65); // it's value is updated later to 61
openAddressingHashtable.set("mahmoud", 61); // edit
openAddressingHashtable.set("youssry", 46);
openAddressingHashtable.set("yasser", 67);
openAddressingHashtable.set("\t", 77)



console.log(openAddressingHashtable.entriesArray);