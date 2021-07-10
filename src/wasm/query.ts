export declare function log(msg: string): void;
// access a key from an item of the collection
export declare function access(i: i32, key: string): string;
// also able to access as list
export declare function accessList(i: i32, j: i32, key: string): string;
// access list length of the key of the item
export declare function accessListLength(i: i32, key: string): i32;
// free a reference
export declare function free(): void;

function unNull(mapOrNull: object | null): object {
    if (mapOrNull instanceof Map) {
        return mapOrNull;
    }
    log("is null")
    return {};
}

export function is(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        // for each item in the collection, compare it to the specified val
        var currentVal = access(i, key);
        if (currentVal == val) {
            out.push(i);
        }
        free();
    }
    return out;
}

export function isnt(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        var currentVal = access(i, key);
        if (currentVal != val) {
            out.push(i);
        }
        free();
    }
    return out;
}

export function greaterThan(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        var currentVal = access(i, key);
        if (currentVal > val) {
            out.push(i);
        }
        free();
    }
    return out;
}

export function lessThan(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        var currentVal = access(i, key);
        if (currentVal < val) {
            out.push(i);
        }
        free();
    }
    return out;
}

export function greaterThanOrEqualTo(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        var currentVal = access(i, key);
        if (currentVal >= val) {
            out.push(i);
        }
        free();
    }
    return out;
}

export function lessThanOrEqualTo(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        var currentVal = access(i, key);
        if (currentVal <= val) {
            out.push(i);
        }
        free();
    }
    return out;
}

export function has(length: i32, key: string, val: string): Array<i32> {
    var out: Array<i32> = [];
    for (var i = 0; i < length; i ++) {
        var listLength = accessListLength(i, key);
        // for every list field in the collection, look for the specified val
        for (var j = 0; j < listLength; j ++) {
            var currentVal = accessList(i, j, key);
            if (currentVal == val) {
                out.push(i);
            }
            free();
        }
    }
    return out;
}
