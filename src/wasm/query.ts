export declare function log(msg: string): void;
export declare function access(i: i32, key: string): string;
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

export function isnt(list: Array<Map<string, string>>, key: string, val: string): Array<Map<string, string> | null> {
    var out: Array<Map<string, string> | null> = new Array<Map<string, string> | null>();
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        if (object[key] != val) {
            out.push(object);
        }
    }
    return out;
}

export function greaterThan(list: Array<Map<string, string>>, key: string, val: i32): Array<Map<string, string> | null> {
    var out: Array<Map<string, string> | null> = new Array<Map<string, string> | null>();
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        if (Number.parseInt(object[key]) > val) {
            out.push(object);
        }
    }
    return out;
}

export function lessThan(list: Array<Map<string, string>>, key: string, val: i32): Array<Map<string, string> | null> {
    var out: Array<Map<string, string> | null> = new Array<Map<string, string> | null>();
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        if (Number.parseInt(object[key]) < val) {
            out.push(object);
        }
    }
    return out;
}

export function greaterThanOrEqualTo(list: Array<Map<string, string>>, key: string, val: i32): Array<Map<string, string> | null> {
    var out: Array<Map<string, string> | null> = new Array<Map<string, string> | null>();
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        if (Number.parseInt(object[key]) >= val) {
            out.push(object);
        }
    }
    return out;
}

export function lessThanOrEqualTo(list: Array<Map<string, string>>, key: string, val: i32): Array<Map<string, string> | null> {
    var out: Array<Map<string, string> | null> = new Array<Map<string, string> | null>();
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        if (Number.parseInt(object[key]) <= val) {
            out.push(object);
        }
    }
    return out;
}

export function has(list: Array<Map<string, string>>, key: string, val: string): Array<Map<string, string> | null> {
    var out: Array<Map<string, string> | null> = new Array<Map<string, string> | null>();
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        var objectList = object[key];
        var openBrackets = 0;
        var acc = ""
        for (var j = 0; j < objectList.length; j ++) {
            var c = objectList.charAt(j);
            if (c == '{') {
                openBrackets += 1;
            }
            else if (c == '}') {
                openBrackets -= 1;
            }
            acc += c;
            
            if (openBrackets == 0) {
                if (acc != "" && acc == val) {
                    out.push(object);
                    break;
                }
                else {
                    acc = "";
                }
            }
        }
    }
    return out;
}
