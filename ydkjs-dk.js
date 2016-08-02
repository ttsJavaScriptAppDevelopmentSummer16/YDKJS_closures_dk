// chapter 1 ****************************

// lookups: LHS vs RHS 

function foo1(a) {
    console.log( a ); 
}

foo1( 2 );


// chapter 2  ***************************

// illustrates lexing

function foo2(a) {

    var b = a * 2;

    function bar2(c) {
        console.log(a, b, c);
    }

    bar2(b * 3);
}

foo2(2); // returns 2 4 12


// you can cheat with 'eval'

function foo3(str, a) {
    eval(str); 
    console.log(a, b);
}

var b = 2;

foo3( "var b = 3;", 1 ); // 1, 3



// chapter 3  ***************************

// hiding in plain scope

function doSomething(a) {
    function doSomethingElse(a) {
        return a - 1;
    }
    var b;
    b = a + doSomethingElse(a * 2);
    console.log( b * 3 );
}
doSomething( 2 ); // returns 15


// functions as scope; can be encased in parentheses and be called immediately (IIFE)

var a = 2;

(function foo4(){ 
    var a = 3;
    console.log(a); // returns 3
})(); 

console.log(a); // returns 2


// chapter 4 ***************************

// var is undefined, due to hoisting

foo5();

function foo5() {
    console.log(a); // var undefined

    var a = 2;
}

// likewise here

function foo5() {
    var a;

    console.log(a); // undefined

    a = 2;
}

foo5();


// will return 1

foo6();

var foo6;

function foo6() {
    console.log( 1 );
}

foo6 = function() {
    console.log( 2 );
};


// will return 3

foo7(); 

function foo7() {
    console.log(1);
}

var foo7 = function() {
    console.log(2);
};

function foo7() {
    console.log(3);
}

// will return 'b'

foo8(); // "b"

var a = true;
if (a) {
   function foo8() { console.log("a"); }
}
else {
   function foo8() { console.log("b"); }
}


// chapter 5: closure *****************************

// a function with normal scope

function foo9() {
    var a = 2;

    function bar9() {
        console.log(a); // returns 2
    }

    bar9();
}

foo9();

// but here, bar10 is accessed outside its scope (and bar10 is still accessible for later)

function foo10() {
    var a = 2;

    function bar10() {
        console.log(a); // returns 2
    }

    return bar10;
}

var baz10 = foo10();

baz10();

// another example of closure

function foo11() {
    var a = 2;

    function baz11() {
        console.log(a); // returns 2
    }

    bar11(baz11);
}

function bar11(fn) {
    fn(); 
}

// function passed around indirectly

var fn12;

function foo12() {
    var a = 2;

    function baz12() {
        console.log(a);
    }

    fn12 = baz12; // assign `baz` to global variable
}

function bar12() {
    fn12(); // closure
}

foo12();

bar12(); // returns 2

// see closure in realtime!

function wait(message) {

    setTimeout( function timer(){
        console.log( message );
    }, 1000 );

}

wait("Hello, closure!");


// an IIFE is not (exactly) a closure, but it's close!

var a13 = 2;

(function IIFE(){
    console.log( a13 );
})();

// loops can employ closures...
// but this loop will not work right

for (var i=1; i<=5; i++) {
    setTimeout( function timer(){
        console.log(i); // prints '6' with a timer-delay each time
    }, i*1000 );
}

// the IIFE creates closure for each iteration of the loop
// but that's not enough... it needs its own variable (scope can't be empty)

for (var i=1; i<=5; i++) {
    (function(){
        var j = i;  
        setTimeout( function timer(){
            console.log( j );  // works as intended
        }, j*1000 );
    })();
}

// modules: outer enclosing function needs to be invoked and return an inner function (so closure occurs)

function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log( something );
    }

    function doAnother() {
        console.log( another.join( " ! " ) );
    }

    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

var foo14 = CoolModule();

foo14.doSomething(); // cool
foo14.doAnother(); // 1 ! 2 ! 3

// this module uses IIFE

var foo15 = (function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log( something );
    }

    function doAnother() {
        console.log( another.join( " ! " ) );
    }

    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
})();

foo15.doSomething(); // cool
foo15.doAnother(); // 1 ! 2 ! 3

// modules can receive parameters

function CoolModule2(id) {
    function identify() {
        console.log( id );
    }

    return {
        identify: identify
    };
}

var foo16 = CoolModule2( "foo 1" );
var foo17 = CoolModule2( "foo 2" );

foo16.identify(); // "foo 1"
foo17.identify(); // "foo 2"

// module manager example

MyModules.define( "bar", [], function(){
    function hello(who) {
        return "Let me introduce: " + who;
    }

    return {
        hello: hello
    };
} );

MyModules.define( "foo", ["bar"], function(bar){
    var hungry = "hippo";

    function awesome() {
        console.log( bar.hello( hungry ).toUpperCase() );
    }

    return {
        awesome: awesome
    };
} );

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );

console.log(
    bar.hello( "hippo" )
); // Let me introduce: hippo

foo.awesome(); // LET ME INTRODUCE: HIPPO

