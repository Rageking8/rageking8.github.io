"use strict";

// Used to toggle whether some debug function are run
const DEBUG = true;

// Utils namespace, check if its falsey and if so set it
// to an empty object
var Utils = Utils || {};

Utils.get_type = function get_type(object)
{
    // Use primitive arguement checking method
    // to prevent cyclic calls
    if (arguments.length != 1)
    {
        throw new ArgumentError(ARG_ERR_MSG.num_args);
    }

    let type = ({}).toString.call(object).match(/\s(\w+)/)[1];

    // 2nd way to get the type (as a fallback for custom types)
    if (type == "Object")
    {
        type = object.constructor.name;
    }

    return type;
}

// Checks that the number of arguments passed in to a function is the
// correct number
//
// * This should be removed using an automated build system as this is only
// used for development to catch semantic errors early and should not incur
// a runtime or script size penalty
Utils.check_args_num = function check_args_num(fn_args, fn_args_num)
{
    // If not in `DEBUG` do not run this check function
    if (!DEBUG) return;

    // Use primitive argument checking method
    // to prevent cyclic calls
    if (arguments.length != 2 ||
        Utils.get_type(fn_args) != "Arguments" ||
        Utils.get_type(fn_args_num) != "Number")
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }

    if (fn_args.length != fn_args_num)
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }
}

// Checks the arguments in `fn_args` against `fn_types`, if found to be
// invalid throw `ArgumentError`
//
// * This should be removed using an automated build system as this is only
// used for development to catch semantic errors early and should not incur
// a runtime or script size penalty
Utils.check_fn_args = function check_fn_args(fn_args, fn_types)
{
    // If not in `DEBUG` do not run this check function
    if (!DEBUG) return;

    // Use primitive argument checking method
    // to prevent cyclic calls
    if (arguments.length != 2 ||
        Utils.get_type(fn_args) != "Arguments" ||
        Utils.get_type(fn_types) != "Array")
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }

    // If `fn_args` does not have the same length as `fn_types`
    Utils.check_args_num(fn_args, fn_types.length);

    for (let i = 0; i < fn_args.length; ++i)
    {
        // Ensure that the elements in `fn_types` is of type `TypeEnum`
        // before checking `fn_args` against it
        if (Utils.get_type(fn_types[i]) != "TypeEnum" ||
            Utils.get_type(fn_args[i]) != fn_types[i].name)
        {
            throw new ArgumentError(ARG_ERR_MSG.args_type);
        }
    }
}

// Helper function to check that the function is not called with more
// than 0 arguments
//
// * This should be removed using an automated build system as this is only
// used for development to catch semantic errors early and should not incur
// a runtime or script size penalty
Utils.check_no_args = function check_no_args(fn_args)
{
    // If not in `DEBUG` do not run this check function
    if (!DEBUG) return;

    // Use primitive argument checking method
    // to prevent cyclic calls
    if (arguments.length != 1 ||
        Utils.get_type(fn_args) != "Arguments")
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }

    Utils.check_fn_args(fn_args, []);
}

// Helper function to check that the array contains all the same type and
// is the same as the one specified in `arr_type`
//
// * This should be removed using an automated build system as this is only
// used for development to catch semantic errors early and should not incur
// a runtime or script size penalty
Utils.check_arr = function check_arr(arr, arr_type, arr_len = -1)
{
    // If not in `DEBUG` do not run this check function
    if (!DEBUG) return;

    // Use primitive argument checking method
    // to prevent cyclic calls
    //
    // Check that the number of arguments is in
    // range [2, 3]
    if (arguments.length < 2 ||
        arguments.length > 3 ||
        Utils.get_type(arr) != "Array" ||
        Utils.get_type(arr_type) != "TypeEnum" ||
        Utils.get_type(arr_len) != "Number")
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }

    // Check the type for all the elements in the array
    for (const idx in arr)
    {
        if (Utils.get_type(arr[idx]) != arr_type.name)
        {
            throw new ArgumentError(ARG_ERR_MSG.val_args);
        }
    }

    // Check if array length check is needed
    if (arr_len > -1)
    {
        if (arr.length != arr_len)
        {
            throw new ArgumentError(ARG_ERR_MSG.val_args);
        }
    }
}

// Helper function to check that the number is positive and `allow_zero`
// is used to set whether `0` is a valid option
//
// * This should be removed using an automated build system as this is only
// used for development to catch semantic errors early and should not incur
// a runtime or script size penalty
Utils.check_num_pos = function check_num_pos(num, allow_zero = true)
{
    // If not in `DEBUG` do not run this check function
    if (!DEBUG) return;
    
    // Use primitive argument checking method
    // to prevent cyclic calls
    //
    // Check that the number of arguments is in
    // range [1, 2]
    if (arguments.length < 1 ||
        arguments.length > 2 ||
        Utils.get_type(num) != "Number" ||
        Utils.get_type(allow_zero) != "Boolean")
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }

    if (num < 0)
    {
        throw new RangeError("Number should not be negative");
    }
    else if (num == 0 && !allow_zero)
    {
        throw new RangeError("Number should not be zero");
    }
}

// Returns a new proxy that will throw an error should an undefined
// property be accessed in that object (in `DEBUG`)
//
// Does not do anything when not in `DEBUG`
Utils.throw_on_undefined_prop = function throw_on_undefined_prop(object)
{
    // If not in `DEBUG` just return the same object
    if (!DEBUG) return object;

    return new Proxy(object, {
        get(target, prop)
        {
            if (prop in target)
            {
                return target[prop];
            }

            throw new ReferenceError(
                "Tried to access undefined property");
        }
    });
}

// Helper function to assert certain conditions are true at the respective
// control flow locations
//
// * This should be removed using an automated build system as this is only
// used for development to catch semantic errors early and should not incur
// a runtime or script size penalty
Utils.assert = function assert(cond, msg = "")
{
    // If not in `DEBUG` do not run this assert function
    if (!DEBUG) return;

    // Use primitive argument checking method
    //
    // Check that the number of arguments is in
    // range [1, 2]
    if (arguments.length < 1 ||
        arguments.length > 2 ||
        Utils.get_type(cond) != "Boolean" ||
        Utils.get_type(msg) != "String")
    {
        throw new ArgumentError(ARG_ERR_MSG.type_and_or_args);
    }

    if (!cond)
    {
        throw new Error(`Assertion failed${msg != "" ?
            " at:\n    " + msg + "\n" : "."}`);
    }
}

Utils.random_range = function random_range(min, max)
{
    Utils.check_fn_args(arguments, Array(2).fill(TYPE.number));
    Utils.assert(min < max);

    return (Math.random() * (max - min)) + min;
}

// Convenience helper method to create an element and set
// its classes
Utils.create_elem = function create_elem(type, ...init_classes)
{
    Utils.assert(Utils.get_type(type) == "String");
    Utils.assert(init_classes.length > 0);
    Utils.check_arr(init_classes, TYPE.string);

    const elem = document.createElement(type);
    elem.classList.add(init_classes);

    return elem;
}

Utils.get_current_page = function get_current_page()
{
    Utils.check_no_args(arguments);

    const path = window.location.pathname;
    
    // Get string after the last `/` and removes the extension
    const page = path.split("/").pop().split(".")[0];

    return page;
}

// Error to be thrown when the type of, number of or value
// of arguments passed in to a function is invalid
class ArgumentError extends Error
{
// Public

    constructor(msg_enum)
    {
        Utils.check_fn_args(arguments, [ TYPE.err_msg_enum ]);

        super(msg_enum.name);
        this.name = this.constructor.name;
    }
}

class Enum
{
// Public

    constructor(name, payload)
    {
        // Use primitive checking here
        Utils.assert(Utils.get_type(name) == "String",
            "`name` needs to be of type `String`");

        this.#name = name;

        payload = payload || {};
        // Make all access to undefined properties throw and
        // `freeze` the `data` object to prevent modifications
        this.#data = Object.freeze(Utils.throw_on_undefined_prop(payload));
    }

    get name()
    {
        return this.#name;
    }

    get get()
    {
        return this.#data;
    }

// Private

    #name = "";
    #data = {};
}

class TypeEnum extends Enum
{
// Public

    constructor(name, payload)
    {
        // Forward all arguments passed in to this constructor even
        // if there are more than the 1 required, so argument
        // checking is not required here and can be deferred to
        // the parent's constructor
        super(...arguments);
    }
}

class ErrMsgEnum extends Enum
{
// Public

    constructor(name, payload)
    {
        // Forward all arguments passed in to this constructor even
        // if there are more than the 1 required, so argument
        // checking is not required here and can be deferred to
        // the parent's constructor
        super(...arguments);
    }
}

class ChartTimeScaleEnum extends Enum
{
// Public

    constructor(name, payload)
    {
        // Forward all arguments passed in to this constructor even
        // if there are more than the 1 required, so argument
        // checking is not required here and can be deferred to
        // the parent's constructor
        super(...arguments);
    }
}

 var TYPE = Utils.throw_on_undefined_prop({
// Primitives
    arguments: new TypeEnum("Arguments"),
    array: new TypeEnum("Array"),
    bool: new TypeEnum("Boolean"),
    number: new TypeEnum("Number"),
    string: new TypeEnum("String"),
    object: new TypeEnum("Object"),
    date: new TypeEnum("Date"),
    undefined: new TypeEnum("Undefined"),
    null: new TypeEnum("Null"),

// HTML types
    html_div_elem: new TypeEnum("HTMLDivElement"),

// Enums
    type_enum: new TypeEnum("TypeEnum"),
    err_msg_enum: new TypeEnum("ErrMsgEnum"),
    chart_time_scale_enum: new TypeEnum("ChartTimeScaleEnum"),

// Events
    pointer_evt: new TypeEnum("PointerEvent"),

// Custom types
    candle: new TypeEnum("Candle"),
 });

const ARG_ERR_MSG = Utils.throw_on_undefined_prop({
    args_type: new ErrMsgEnum("Type of arguments passed in is invalid"),
    num_args: new ErrMsgEnum("Number of arguments passed in is invalid"),
    val_args: new ErrMsgEnum("Value of arguments passed in is invalid"),
    type_and_or_args:
        new ErrMsgEnum("Type of or number of arguments passed in is invalid"),
});

// Represents a single candle in a candlestick chart
class Candle
{
// Public

    constructor(init_low, init_high, init_open, init_close)
    {
        Utils.check_fn_args(arguments, Array(4).fill(TYPE.number));

        this.set_all(init_low, init_high, init_open, init_close);
    }

    get low()
    {
        return this.#low;
    }

    set low(new_low)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        if (!this.#validate_low(new_low))
        {
            throw new RangeError(
                "`new_low` must be positive and lower " +
                "than or equal to the current `high`");
        }

        this.#low = new_low;
    }

    get high()
    {
        return this.#high;
    }

    set high(new_high)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        if (!this.#validate_high(new_high))
        {
            throw new RangeError(
                "`new_high` must be positive and higher " +
                "than or equal to the current `low`");
        }

        this.#high = new_high;
    }

    get open()
    {
        return this.#open;
    }

    set open(new_open)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        if (!this.#validate_open(new_open))
        {
            throw new RangeError(
                "`new_open` must be within range [low, high]");
        }

        this.#open = new_open;
    }

    get close()
    {
        return this.#close;
    }

    set close(new_close)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        if (!this.#validate_close(new_close))
        {
            throw new RangeError(
                "`new_close` must be within range [low, high]");
        }

        this.close = new_close;
    }

    set_all(set_low, set_high, set_open, set_close)
    {
        Utils.check_fn_args(arguments, Array(4).fill(TYPE.number));

        if (!this.#validate_all(set_low, set_high, set_open, set_close))
        {
            throw new RangeError("1 or more of the set vars are invalid");
        }

        this.#low = set_low;
        this.#high = set_high;
        this.#open = set_open;
        this.#close = set_close;
    }

// Private

    // Returns whether the candle data is valid with `low_val`
    #validate_low(low_val)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        // Ensure that `low_val` is positive and is lower
        // than or equal to the current `high`
        return low_val >= 0 && low_val <= this.#high;
    }

    // Returns whether the candle data is valid with `high_val`
    #validate_high(high_val)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        // Ensure that `high_val` is positive and is higher
        // than or equal to the current `low`
        return high_val >= 0 && high_val >= this.#low;
    }

    // Returns whether the candle data is valid with `open_val`
    #validate_open(open_val)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        // Ensure that `open_val` is within range [low, high]
        return open_val >= this.#low && open_val <= this.#high;
    }

    // Returns whether the candle data is valid with `close_val`
    #validate_close(close_val)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        // Ensure that `close_val` is within range [low, high]
        return close_val >= this.#low && close_val <= this.#high;
    }

    // Returns whether all candle data is valid with
    // respect to each other
    #validate_all(low_val, high_val, open_val, close_val)
    {
        Utils.check_fn_args(arguments, Array(4).fill(TYPE.number));

        // Ensure all 4 arguments are positive, `low_val` is
        // lower than or equal to `high_val` and both `open_val`
        // and `close_val` are in range [low_val, high_val]
        return low_val >= 0 && low_val <= high_val &&
            open_val >= low_val && open_val <= high_val &&
            close_val >= low_val && close_val <= high_val;
    }

    #low = 0;
    #high = 0;

    #open = 0;
    #close = 0;
}

// Represents the whole candle chart with all the candles
class CandleChart
{
// Public

    CHART_TIME_SCALE = Utils.throw_on_undefined_prop({
        one_sec: new ChartTimeScaleEnum("1 SEC", { milli: 1000 }),
        five_sec: new ChartTimeScaleEnum("5 SEC", { milli: 5 * 1000 }),
        one_min: new ChartTimeScaleEnum("1 MIN", { milli: 60 * 1000 }),
        five_min: new ChartTimeScaleEnum("5 MIN", { milli: 5 * 60 * 1000 }),
        one_hr: new ChartTimeScaleEnum("1 HOUR", { milli: 60 * 60 * 1000 }),
        one_day: new ChartTimeScaleEnum("1 DAY",
            { milli: 24 * 60 * 60 * 1000 }),
    });

    constructor()
    {
        this.#price_map = new Map;
    }

    add_price_entry(date, price)
    {
        Utils.check_fn_args(arguments, [ TYPE.date, TYPE.number ]);
        Utils.check_num_pos(price);
        
        this.#price_map.set(date.getTime(), price);
    }

    // Add a random price entry `delta_time` after the
    // latest entry with `magnitude` being the range
    // of the random price with reference to the previous
    // latest price (N) and `growth`, the range is
    // [N - magnitude, N + magnitude + growth]
    add_random_price_entry(delta_time, magnitude, growth)
    {
        Utils.check_fn_args(arguments,
            [ TYPE.chart_time_scale_enum, TYPE.number, TYPE.number ]);
        Utils.check_num_pos(magnitude, false);

        const latest_date = this.get_latest_date();
        const latest_price = this.get_latest_price();

        const random_price = Utils.random_range(
            latest_price - magnitude, latest_price + magnitude + growth);
        
        // Get new time
        const new_date = new Date(latest_date + delta_time.get.milli);
        
        this.add_price_entry(new_date, random_price);
    }

    get_earliest_date()
    {
        Utils.check_no_args(arguments);

        return Math.min(...this.#price_map.keys());
    }

    get_latest_date()
    {
        Utils.check_no_args(arguments);

        return Math.max(...this.#price_map.keys());
    }

    get_max_price()
    {
        Utils.check_no_args(arguments);

        return Math.max(...this.#price_map.values());
    }

    get_latest_price()
    {
        Utils.check_no_args(arguments);

        return this.#price_map.get(this.get_latest_date());
    }

    // Number of candles needed to represent start to end of
    // price data avaliable, dependent on time scale
    candles_needed()
    {
        Utils.check_no_args(arguments);

        const milli_diff = this.get_latest_date() - this.get_earliest_date();
        
        return Math.ceil(milli_diff / this.#scale.get.milli);
    }

    // Used to generate a candle at the correct time scale to be
    // used for rendering
    get_candle(index)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        const candles_needed = this.candles_needed();
        Utils.assert(index < candles_needed,
            "`index` out of range");

        const start = this.get_earliest_date() +
            (index * this.#scale.get.milli);
        const end = start + this.#scale.get.milli;

        let low = 1000000000;
        let high = -1;
        let open;
        let close;

        // Used for getting `open` and `close`, since the map
        // might not be in chronological order
        let earliest_one = 0;
        let latest_one = 0;

        for (const data of this.#price_map)
        {
            // Within the current candle
            if (data[0] >= start && data[0] <= end)
            {
                // Handle open
                if (earliest_one == 0 || data[0] < earliest_one)
                {
                    earliest_one = data[0];
                    open = data[1];
                }

                // Handle close
                if (latest_one == 0 || data[0] > latest_one)
                {
                    latest_one = data[0];
                    close = data[1];
                }

                // Handle low
                if (data[1] < low)
                {
                    low = data[1];
                }

                // Handle high
                if (data[1] > high)
                {
                    high = data[1];
                }
            }
        }

        return new Candle(low, high, open, close);
    }

    // Remove the oldest data point
    remove_oldest(count)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);
        Utils.assert(count > 0);

        for (let i = 0; i < count; ++i)
        {
            this.#price_map.delete(
                this.#price_map.keys().next().value);
        }
    }

    // Removes extra candles once exceed `max_candles`
    prune()
    {
        Utils.check_no_args(arguments);

        while (this.#price_map.size > this.#max_candles)
        {
            this.remove_oldest();
        }
    }

    get_size()
    {
        Utils.check_no_args(arguments);

        return this.#price_map.size;
    }
    
    get price_map()
    {
        return this.#price_map;
    }

    get scale()
    {
        return this.#scale;
    }

    set scale(new_scale)
    {
        Utils.check_fn_args(arguments, [ TYPE.chart_time_scale_enum ]);

        this.#scale = new_scale;
    }

    get max_candles()
    {
        return this.#max_candles;
    }

    set max_candles(new_max_candles)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        this.#max_candles = new_max_candles;
    }

// Private

    #price_map;
    #scale = this.CHART_TIME_SCALE.five_sec;
    #max_candles = 500;
}

// Class used to render the whole candle chart
class CandleChartRenderer
{
// Public

    constructor()
    {

    }

    // Generate the raw elements required in a single
    // candle
    static generate_candle()
    {
        Utils.check_no_args(arguments);

        const candle = document.createElement("div");
        candle.classList.add("candle");

        const fragment = document.createDocumentFragment();

        const candle_body = Utils.create_elem("div", "candle-body");
        fragment.appendChild(candle_body);

        const candle_wick = Utils.create_elem("div", "candle-wick");
        fragment.appendChild(candle_wick);

        candle.appendChild(fragment);

        return candle;
    }

    // Generate a single candle with the parent set
    static gen_candle_parent(parent)
    {
        Utils.check_fn_args(arguments, [ TYPE.html_div_elem ]);

        const elem = this.generate_candle();
        parent.appendChild(elem);

        return elem;
    }
}

// Class having some time helper methods
class Time
{
// Public

    constructor()
    {
        Utils.check_no_args(arguments);

        // Init private variables
        this.#start_time = performance.now();
        this.#dt_time = this.#start_time;
    }

    // Returns time elapsed since the last call to this function
    // in milliseconds. If it is the first call, return time
    // elapsed since object construction
    dt()
    {
        Utils.check_no_args(arguments);

        let current_time = performance.now();
        let time_diff = current_time - this.#dt_time;

        this.#dt_time = current_time;

        return time_diff;
    }

    // Returns time elapsed in milliseconds since the object construction
    since_start()
    {
        Utils.check_no_args(arguments);

        return performance.now() - this.#start_time;
    }

    get start_time()
    {
        return this.#start_time;
    }

// Private

    #start_time;

    // Used to compute delta time
    #dt_time;
}

// This animation starts with no text then types out character
// by character till the end, before moving to the next string
// in `str_arr`. Once all strings are expended, it will loop
// back to the front and repeat
class TypewriterAni
{
// Public

    constructor(str_arr, time_step, accum_delay)
    {
        Utils.check_fn_args(arguments,
            [ TYPE.array, TYPE.number, TYPE.number ]);
        Utils.check_arr(str_arr, TYPE.string);

        if (str_arr.length == 0)
        {
            throw new ArgumentError(ARG_ERR_MSG.val_args);
        }

        this.#str_arr = str_arr;

        if (time_step <= 0)
        {
            throw new RangeError("`time_step` must be more than 0");
        }

        this.#cur_prog = {
            // Index for `str_arr`
            cur_str_arr_idx: 0,

            // Index for the current str itself
            cur_str_idx: 0,
        };

        this.#time_step = time_step;
        this.#accum_delay = accum_delay;
        this.#accumulator = 0;
    }

    update(dt)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        this.#accumulator += dt;

        // Use `accum_delay` to offset the `accumulator` first
        if (this.#accum_delay > 0)
        {
            // There is enough in `accumulator` to clear
            // `accum_delay`
            if (this.#accumulator >= this.#accum_delay)
            {
                this.#accumulator -= this.#accum_delay;
                this.#accum_delay = 0;
            }
            // Not enough to clear, will continue next `update`
            else
            {
                this.#accum_delay -= this.#accumulator;
                this.#accumulator = 0;
            }

            // Exit the function as no more stuff to do here
            return;
        }

        // Nullify the `accumulator` value should it breach
        // the `accum_threshold` (user left the page and came
        // back)
        if (this.#accumulator >= this.#accum_threshold)
        {
            this.#accumulator = 0;
            return;
        }

        // Perform the keyframe transition once the timestep
        // elapsed, able to do more than 1 per frame if enough
        // real time elapsed
        while (this.#accumulator > this.#time_step)
        {
            let cur_str_arr_idx = this.#cur_prog.cur_str_arr_idx;
            let cur_str_idx = this.#cur_prog.cur_str_idx;

            // There is still characters left in the current string
            if (cur_str_idx < this.#str_arr[cur_str_arr_idx].length)
            {
                this.#cur_prog.cur_str_idx++;
            }
            // There is still strings left in the array
            else if (cur_str_arr_idx < this.#str_arr.length - 1)
            {
                this.#cur_prog.cur_str_arr_idx++;
                this.#cur_prog.cur_str_idx = 0;
            }
            // There is no more strings left in the array,
            // loop back to the front
            else
            {
                this.#cur_prog.cur_str_arr_idx = 0;
                this.#cur_prog.cur_str_idx = 0;
            }
            
            this.#accumulator -= this.#time_step;
        }
    }

    // Get the current string the typewriter is at
    get_str()
    {
        Utils.check_no_args(arguments);

        return this.#str_arr[this.#cur_prog.cur_str_arr_idx].
            substr(0, this.#cur_prog.cur_str_idx);
    }

    // Add delay to the typewriter in milliseconds
    add_delay(delay)
    {
        Utils.check_fn_args(arguments, [ TYPE.number ]);

        if (delay < 0)
        {
            throw new RangeError("`delay` cannot be negative");
        }

        this.#accum_delay += delay;
    }

// Private

    // Store all the different strings
    // in the typewriter
    #str_arr;

    // Used to track current progress
    // of the animation
    #cur_prog;

    // Time elapsed before one keyframe is
    // progressed in milliseconds
    #time_step;

    // Used to offset the accumulator (can be
    // used to add start or random delays to the
    // typewriter)
    #accum_delay;

    // Use to keep track of time elapsed and
    // when to move to the next keyframe
    #accumulator;

    // If `accumulator` value is more than or equal
    // to `accum_threshold` nullify it (since it means
    // the user left the page and came back)
    #accum_threshold = 1000;
}

// Class that handles updates per frame and the rendering of animation
// and other items
class Program
{
// Public

    // Initialization
    // Ran before then first `update` or `render`
    start()
    {
        // Initialize time object
        this.#time = new Time;

        this.#current_page = "index";

        this.#dom_refs = {};

        // Catch undefined property accesses when in `DEBUG`
        this.#dom_refs = Utils.throw_on_undefined_prop(this.#dom_refs);

        // Set some dom element references
        this.#dom_refs["main-landing-section"] =
            document.querySelector("#main-landing-section");
        this.#dom_refs["main-section-chart"] =
            document.querySelector("#main-section-chart");

        // Sandbox chart
        this.#dom_refs["sandbox-section-chart"] =
            document.querySelector("#sandbox-section-chart");
        this.#dom_refs["sandbox-current-price"] =
            document.querySelector("#sandbox-current-price");
        this.#dom_refs["sandbox-profits"] =
            document.querySelector("#sandbox-profits");

        this.#dom_refs["main-section-h2"] =
            document.querySelector("#main-landing-section h2");
        
        // Setup main section type writer animation
        let main_landing_section_ani_arr =
            [ "Stocks", "Options", "Futures", "ETFs", "CFDs",
            "Bonds", "Funds", "Swaps", "Forex", "Forward" ];
        this.#typewriter_ani = new TypewriterAni(
            main_landing_section_ani_arr, 250, 1000);

        // Main section candle chart
        this.#main_section_candle_chart = new CandleChart();
        this.#main_section_candle_chart.scale =
            this.#main_section_candle_chart.CHART_TIME_SCALE.one_min;
        
        // Simple starting price data
        this.#main_section_candle_chart.add_price_entry(
            new Date("2023-08-07T01:00:00"), 100
        );

        setInterval(this.#update_main_section_candle_chart.bind(this), 50);

        // Sandbox section candle chart
        this.#sandbox_section_candle_chart = new CandleChart();
        this.#sandbox_section_candle_chart.max_candles = 1500;
        this.#sandbox_section_candle_chart.scale =
            this.#sandbox_section_candle_chart.CHART_TIME_SCALE.one_min;

        // Simple starting price data
        this.#sandbox_section_candle_chart.add_price_entry(
            new Date("2023-08-07T01:00:00"), 100
        );

        setInterval(this.#update_sandbox_section_candle_chart.bind(this), 50);

        this.#init_content_section_list();
        this.#init_content_nav();
        this.#init_sandbox();

        // Start update and render loop, with it syncing to
        // browser repaints
        window.requestAnimationFrame(this.#update.bind(this));
    }

// Private

    // Called per frame
    #update()
    {
        // Grab `dt` for use in updates
        let dt = this.#time.dt();

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update typewriter and the underlying h2
        this.#typewriter_ani.update(dt);
        this.#dom_refs["main-section-h2"].innerText =
            this.#typewriter_ani.get_str();
        
        if (window.innerWidth > 800)
        {
            this.#dom_refs["main-landing-section"].style.clipPath =
                "path(\'M 0 0 L " + width + " 0 " + width + " " + (height * 1.14) + " C " +
                (width * 0.75) + " " + (height * 1.35) + ", " + (width * 0.25) + " " +
                (height * 1.05) + ", 0 " + (height * 1.2) + " z\')";
        }
        else
        {
            this.#dom_refs["main-landing-section"].style.clipPath = "";
        }

        // Update sandbox text displays
        this.#dom_refs["sandbox-current-price"].innerText =
            "$ " + this.#sandbox_section_candle_chart.get_latest_price().toFixed(2);
        this.#dom_refs["sandbox-profits"].innerText =
            "Profits: $ " + this.#sandbox_profits.toFixed(2);

        this.#update_page();

        // After updates are done, render
        this.#render();
        
        // Request for the next repaint/frame
        window.requestAnimationFrame(this.#update.bind(this));
    }
    
    // Update what current page the user is seeing right now
    #update_page()
    {
        const allowed_child_types = [ "SECTION", "NAV" ];

        let page = Utils.get_current_page();

        if (!this.#use_history_api)
        {
            page = this.#current_page;
        }

        for (let section of document.body.children)
        {
            // Skip if the node type is not one of the allowed ones
            if (!allowed_child_types.includes(section.nodeName))
            {
                continue;
            }

            const attr = section.dataset.page;

            // Skip if the node does not have the data attribute
            if (attr === undefined)
            {
                continue;
            }

            // Split it up by space as the element can be visible
            // in multiple pages
            const shown_on = attr.split(" ");

            if (shown_on.includes(page))
            {
                section.style.display = "flex";
            }
            else
            {
                section.style.display = "none";
            }
        }
    }

    // Called within `update` after updating
    #render()
    {
        const master_scale = 10;

        const charts = [
            this.#dom_refs["main-section-chart"],
            this.#dom_refs["sandbox-section-chart"]
        ];

        const candle_charts = [
            this.#main_section_candle_chart,
            this.#sandbox_section_candle_chart
        ];

        // Render the 2 different candle charts in the program
        for (let i = 0; i < charts.length; ++i)
        {
            const chart = charts[i];
            const all_candles = chart.children[1];

            const candle_chart = candle_charts[i];
            const chart_size = candle_chart.candles_needed();

            while (all_candles.childElementCount != chart_size)
            {
                if (all_candles.childElementCount < chart_size)
                {
                    CandleChartRenderer.gen_candle_parent(all_candles);
                }
                else
                {
                    // Remove first candle div
                    chart.removeChild(chart.querySelectorAll(".candle"));
                }
            }

            const max_price = candle_chart.get_max_price();

            const price_line =
                chart.querySelector(".candle-chart-price-line");

            // Render main section chart
            for (let i = 0; i < chart_size; ++i)
            {
                const current_div = all_candles.children[i];
                const body_div = current_div.children[0];
                const wick_div = current_div.children[1];

                const current_candle = candle_chart.get_candle(i);
                const full_range = current_candle.high - current_candle.low;
                const range = Math.abs(current_candle.open - current_candle.close);

                const is_green = current_candle.open <= current_candle.close;
                const global_y = max_price - current_candle.high;
                let body_y;

                if (is_green)
                {
                    body_div.classList.remove("candle-red");
                    body_div.classList.add("candle-green");
                    body_y = current_candle.high - current_candle.close;
                }
                else
                {
                    body_div.classList.add("candle-red");
                    body_div.classList.remove("candle-green");
                    body_y = current_candle.high - current_candle.open;
                }

                // Set style parameters for candle body
                body_div.style.height = (master_scale * range) + "px";
                body_div.style.top = (master_scale * (body_y + global_y)) + "px";
                body_div.style.left = (i * 30) + "px";

                // Set style parameters for candle wick
                wick_div.style.height = (master_scale * full_range) + "px";
                wick_div.style.top = (master_scale * global_y) + "px";
                wick_div.style.left = (i * 30) + 13.75 + "px";

                // If this is the last candle for rendering
                if (i == chart_size - 1)
                {
                    price_line.style.top =
                        (master_scale * (max_price - current_candle.close)) + "px";
                    price_line.style.width = ((i + 1) * 30) + 20 + "px";
                }
            }
        }
    }

    // Set event listeners for content section list
    #init_content_section_list()
    {
        Utils.check_no_args(arguments);

        const content_section_list =
            this.#add_dom_refs("content-section-list");
        
        const callbacks = [
            this.#what_are_the_different_trading_instruments.bind(this),
            this.#the_different_types_of_traders.bind(this),
            this.#what_is_a_candle_chart.bind(this),
            this.#how_to_read_a_candle_chart.bind(this),
            this.#how_to_manage_risk.bind(this)
        ];

        for (let i = 0; i < callbacks.length; ++i)
        {
            content_section_list.children[i].
                addEventListener("click", callbacks[i]);
        }
    }

    // Set event listeners for nav bar
    #init_content_nav()
    {
        const content_nav_home =
            this.#add_dom_refs("content-nav-home");
        const content_nav_contents =
            this.#add_dom_refs("content-nav-contents");
        const content_nav_sandbox =
            this.#add_dom_refs("content-nav-sandbox");
        
        content_nav_home.addEventListener("click",
            this.#index.bind(this));
        content_nav_contents.addEventListener("click",
            this.#index_content.bind(this));
        content_nav_sandbox.addEventListener("click",
            this.#sandbox.bind(this));
    }

    // Set event listeners for sandbox
    #init_sandbox()
    {
        const buy_btn =
            this.#add_dom_refs("sandbox-buy-btn");
        const sell_btn =
            this.#add_dom_refs("sandbox-sell-btn");
        
        buy_btn.addEventListener("click",
            this.#sandbox_buy.bind(this));
        sell_btn.addEventListener("click",
            this.#sandbox_sell.bind(this));
    }

    #add_dom_refs(id)
    {
        Utils.check_fn_args(arguments, [ TYPE.string ]);

        this.#dom_refs[id] = document.querySelector("#" + id);

        return this.#dom_refs[id];
    }

    // Moves to this page
    #index()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "Trading", "index.html");
            this.#current_page = "index";
        }
        catch
        {
            this.#current_page = "index";
            this.#use_history_api = false;
        }
    }

    // Moves to this sub-page
    #index_content()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        this.#index(arguments[0]);
        window.location.hash = "#content-section";

        scroll(0, window.innerHeight * 1.2);
    }

    // Moves to this page
    #sandbox()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "Sandbox", "sandbox.html");
            this.#current_page = "sandbox";
        }
        catch
        {
            this.#current_page = "sandbox";
            this.#use_history_api = false;
        }

        // Move to top of page
        scroll(0, 0);
    }

    // Moves to this page
    #what_are_the_different_trading_instruments()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "What are the different trading instruments",
                "what-are-the-different-trading-instruments.html");
            this.#current_page = "what-are-the-different-trading-instruments";
        }
        catch
        {
            this.#current_page = "what-are-the-different-trading-instruments";
            this.#use_history_api = false;
        }

        // Move to top of page
        scroll(0, 0);
    }

    // Moves to this page
    #the_different_types_of_traders()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "The different types of traders",
                "the-different-types-of-traders.html");
            this.#current_page = "the-different-types-of-traders";
        }
        catch
        {
            this.#current_page = "the-different-types-of-traders";
            this.#use_history_api = false;
        }

        // Move to top of page      
        scroll(0, 0);
    }

    // Moves to this page
    #what_is_a_candle_chart()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "What is a candle chart",
                "what-is-a-candle-chart.html");
            this.#current_page = "what-is-a-candle-chart";
        }
        catch
        {
            this.#current_page = "what-is-a-candle-chart";
            this.#use_history_api = false;
        }

        // Move to top of page       
        scroll(0, 0);
    }

    // Moves to this page
    #how_to_read_a_candle_chart()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "How to read a candle chart",
                "how-to-read-a-candle-chart.html");
            this.#current_page = "how-to-read-a-candle-chart";
        }
        catch
        {
            this.#current_page = "how-to-read-a-candle-chart";
            this.#use_history_api = false;
        }   

        // Move to top of page        
        scroll(0, 0);
    }

    // Moves to this page
    #how_to_manage_risk()
    {
        Utils.check_fn_args(arguments, [ TYPE.pointer_evt ]);

        // Handle case where the page is just open using file protocol
        try
        {
            history.pushState({}, "How to manage risk",
                "how-to-manage-risk.html");
            this.#current_page = "how-to-manage-risk";
        }
        catch
        {
            this.#current_page = "how-to-manage-risk";
            this.#use_history_api = false;
        }

        // Move to top of page        
        scroll(0, 0);
    }

    // Add 1 random price point to the main section candle chart
    #update_main_section_candle_chart()
    {
        this.#main_section_candle_chart.add_random_price_entry(
            this.#main_section_candle_chart.CHART_TIME_SCALE.one_sec, 1, 0.03);
    }

    // Add 1 random price point to the sandbox section candle chart
    #update_sandbox_section_candle_chart()
    {
        this.#sandbox_section_candle_chart.add_random_price_entry(
            this.#sandbox_section_candle_chart.CHART_TIME_SCALE.one_sec, 1, 0.015);
    }

    // Sandbox buy button callback
    #sandbox_buy()
    {
        if (this.#sandbox_in_buy)
        {
            return;
        }

        const buy_btn = this.#dom_refs["sandbox-buy-btn"];
        const sell_btn = this.#dom_refs["sandbox-sell-btn"];
        const current_price =
            this.#sandbox_section_candle_chart.get_latest_price();

        if (!this.#sandbox_in_sell)
        {
            buy_btn.classList.replace("button-green", "button-grey");
            this.#sandbox_in_price = current_price;
            this.#sandbox_in_buy = true;
        }
        else
        {
            sell_btn.classList.replace("button-grey", "button-red");
            this.#sandbox_profits += this.#sandbox_in_price - current_price;
            this.#sandbox_in_sell = false;
        }        
    }

    // Sandbox sell button callback
    #sandbox_sell()
    {
        if (this.#sandbox_in_sell)
        {
            return;
        }

        const buy_btn = this.#dom_refs["sandbox-buy-btn"];
        const sell_btn = this.#dom_refs["sandbox-sell-btn"];
        const current_price =
            this.#sandbox_section_candle_chart.get_latest_price();

        if (!this.#sandbox_in_buy)
        {
            sell_btn.classList.replace("button-red", "button-grey");
            this.#sandbox_in_price = current_price;
            this.#sandbox_in_sell = true;
        }
        else
        {
            buy_btn.classList.replace("button-grey", "button-green");
            this.#sandbox_profits += current_price - this.#sandbox_in_price;
            this.#sandbox_in_buy = false;
        }
    }

    #use_history_api = true;
    #current_page;

    #time;

    // Store dom element references
    #dom_refs;

    #typewriter_ani;

    #main_section_candle_chart;
    #sandbox_section_candle_chart;

    #sandbox_profits = 0;
    #sandbox_in_price = 0;
    #sandbox_in_buy = false;
    #sandbox_in_sell = false;
}

// Program entry point, no other codes to be ran
// outside of `main` (at top level)
(function main()
{
    let program = new Program;

    program.start();
})();
