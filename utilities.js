// Arrays
// first, return the first element in an array.
// last, return the last element in an array.
// without, return a new array that does not contain the value passed to it.
// range, return an array of values starting at 0 when a single number is supplied. If two arguments are supplied, returns an array of values that start with the first argument and ends with the second value.
// lastIndexOf, return the last index of the supplied value.
// sample, return a single value from an array when no argument is supplied. Return an array of multiple, non-repeated elements when a quantity is supplied.


// Objects
// findWhere, return the first object with properties that match the supplied object. If no objects match all the supplied properties, undefined is returned.
// where, return an array of all objects with properties that match the supplied object.
// pluck, return an array of the values that match the supplied key from a collection of objects.
// keys, return an array of the keys from an object.
// values, return an array of the values from an object.
// extend, takes two or more objects, taking the properties and values from the last argument and adding them to the argument before it. Object extensions occur recursively from last argument to first. The first argument ends up being modified to include all properties and values from the other objects passed in.
// pick, return a new object with the passed in properties taken from the old object. Accepts one or more arguments.
// omit, return a new object with any passed in properties omitted.
// has, return true when the property passed in exists, false if it doesn't.

// Utility Methods
// isElement, return true if argument is a DOM element.
// isArray, return true if argument is an array.
// isObject, return true if argument is an object or a function.
// isFunction, return true if argument is a function.
// isString, return true if argument is a string.
// isNumber, return true if argument is a number. Also returns true for objects created with the Number constructor.
// isBoolean, return true if argument is a boolean. Also returns true for objects created with the Boolean constructor

(function() {
    var findObjs = function(element, props, multiple) {
        var match = multiple ? [] : undefined;

        element.some(function(obj) { // if a conditon passes, some will return true
            var all_match = true;
            for (var prop in props) { // prop in passed in props (array of objects)
                if (!(prop in obj) || obj[prop] !== props[prop]) { // if all equals false
                    all_match = false; 
                }
            }

            if (all_match) {
                if (multiple) {
                    match.push(obj);
                } else {
                    match = obj;
                    return true;
                }
            }
        });
        return match; // return the obj

    };
    var _ = function(element) {
        u = {
            first: function() {
                return element[0];
            },
            last: function() {
                return element[element.length - 1];
            }, 
            without: function() {
                var new_arr = [];
                var args = Array.prototype.slice.call(arguments); // turns all arguments into an array

                new_arr = element.filter(function(el) {
                    return args.indexOf(el) === -1;
                });
                return new_arr;
            },
            lastIndexOf: function(search) {
                var idx = -1;

                for (var i = element.length; i >= 0; i--) {
                    if (element[i] === search) {
                        idx = i;
                        break;
                    }
                }
                return idx;
            }, 
            sample: function(qty) {
                var sampled = [];
                var copy = element.slice();
                var get = function() {
                    var idx = Math.floor(Math.random() * copy.length);
                    var el = copy[idx];
                    
                    copy.splice(idx, 1);
                    return el;
                };

                if (!qty) { return get(); }

                while (qty > 0) {
                    sampled.push(get());
                    qty--;
                }

                return sampled;
            }, 
            findWhere: function(props) {
                return findObjs(element, props, false);
            }, 
            where: function(props) {
                return findObjs(element, props, true);
            }, 
            pluck: function(query) {
                // [{quantity: 5}, {quantity: 3}]

                var vals = [];
                
                // return element.filter(function(obj) {
                //     if (obj[query]) {
                //         return obj[query];
                //     }
                // });

                element.forEach(function(obj) {
                    if (obj[query]) {
                        vals.push(obj[query]);
                    }
                });
                return vals;
            }, 
            keys: function() {
                // return keys of an array of objects
                var keys = [];
                for (var prop in element) {
                    keys.push(prop);
                }
                return keys;
            }, 
            values: function() {
                var values = [];
                for (var prop in element) {
                    values.push(element[prop]);
                }
                return values;
            }, 
            pick: function() {
                var args = Array.prototype.slice.call(arguments);
                var new_obj = {};

                args.forEach(function(prop) {
                    if (prop in element) {
                        new_obj[prop] = element[prop]; 
                    }
                });
                return new_obj;
            }, 
            omit: function() {
                var args = Array.prototype.slice.call(arguments);
                var new_obj = {};

                args.forEach(function(prop) {
                    for (prop in element) {
                        if (args.indexOf(prop) === -1) {
                            new_obj[prop] = element[prop];
                        }
                    }
                });
                return new_obj;
            }, 
            has: function(prop) {
                return {}.hasOwnProperty.call(element, prop);
            }
        };

        (["isElement", "isArray", "isObject", "isFunction", "isBoolean", "isString", "isNumber"]).forEach(function(method) {
            u[method] = function() { _[method].call(u, element); };
        });
        return u;


    };

    _.range = function(start, stop) {
        var range = [];
        if (stop === undefined) {
            stop = start;
            start = 0;
        }

        for (var i = start; i < stop; i++) {
            range.push(i);
        }

        return range;
    };
    _.extend = function() {
        var args = Array.prototype.slice.call(arguments);
        var old_obj = args.pop();
        var new_obj = args[args.length - 1];


        for (var prop in old_obj) {
            new_obj[prop] = old_obj[prop];   
        }

        return args.length === 1 ? new_obj : _.extend.apply(_, args);
    };
    _.isElement = function(obj) {
        return obj && obj.nodeType === 1;
    };
    _.isArray = Array.isArray || function(obj) {
        return toString.call(obj) === "[object Array]";
    };
    _.isObject = function(obj) {
        var type = typeof obj;

        return type === 'function' || type === 'object' && !!obj;
    };
    _.isFunction = function(obj) {
        var type = typeof obj;

        return type === 'function' && !!obj;
    };

    (["Boolean", "String", "Number"]).forEach(function(method) {
        _["is" + method] = function(obj) {
            return toString.call(obj) === "[object " + method + "]";
        };
    });
    // _.isBoolean = function(obj) {
    //     // checks to see primitive type booleans && object type boolean
    //     return toString.call(obj) === "[object Boolean]";
    // };
    // _.isString = function(obj) {
    //     return toString.call(obj) === "[object String]";
    // };
    // _.isNumber = function(obj) {
    //     return toString.call(obj) === "[object Number]";
    // };


    window._ = _; // attach underscore variable to the window object
})();