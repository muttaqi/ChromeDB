export declare function log(msg: string): void;
export declare function access(i: i32, key: string): string;
export declare function accessList(i: i32, j: i32, key: string): string;
export declare function accessListLength(i: i32, key: string): i32;
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
