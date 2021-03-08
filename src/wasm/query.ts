export function is(list: Array<Map<string, string>>, key: string, val: string): Array<Map<string, string>> {
    var out: Array<Map<string, string>> = [];
    for (var i = 0; i < list.length; i ++) {
        var object = list[i];
        if (object[key] === val) {
            out.push(object);
        }
    }
    return out;
}