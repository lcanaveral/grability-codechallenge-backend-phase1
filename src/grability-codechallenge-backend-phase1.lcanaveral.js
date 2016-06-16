
jQuery(function($) {
    $('body').terminal({

        help: function() {
            this.echo("\tavailable commands are:");
        },

        unit_test: function() {
            $('#qunit').toggle();
        },
        step0: function() {
            this.echo('\twrite the number(T) of test-cases');
            this.push(function(input, term) {
                var inputs = $.terminal.parseArguments(input);

                if (ApplicationControl.validateT(inputs[0])) {
                    ApplicationControl.T = inputs[0];
                    term.pop();
                    term.exec('step1', true);
                    return;
                }
                term.echo('\tT must be a number between 1 to 50');
            }, {
                prompt: 'T:'
            });
        },
        step1: function() {
            this.echo('write N M');
            this.echo('\tN would be the number of elements of each dimension');
            this.echo('\tM would be the number of operations for each test case');
            this.push(function(input, term) {
                var inputs = $.terminal.parseArguments(input);

                if (!ApplicationControl.validateN(inputs[0])) {
                    term.echo('\tN must be a number between 1 to 100');
                } else if (!ApplicationControl.validateM(inputs[1])) {
                    term.echo('\tM must be a number between 1 to 1000');
                    return;
                }

                CubeSummation.init(inputs[0]);
                ApplicationControl.N = inputs[0];
                ApplicationControl.M = inputs[1];

                term.pop();
                term.exec('step2', true);


            }, {
                prompt: 'N M:'
            });
        },
        step2: function() {
            this.echo('\t type [[gi;green;black]update] x y z W to change the value of (x,y,z)');
            this.echo('\t type [[gi;green;black]query] x1 y1 z1 x2 y2 z2  to sum matrix values');


            this.push(function(input, term) {
                var inputs = $.terminal.parseArguments(input);

                if (inputs[0] != 'update' && inputs[0] != 'query') {
                    term.echo('\t you only can use [[gi;green;black]update] and [[gi;green;black]query command]');
                    return;
                }

                if (inputs[0] == 'update') {
                    CubeSummation.update(inputs[1], inputs[2], inputs[3], inputs[4]);
                    term.echo('\t updated: (' + inputs[1] + ','+ inputs[2] + ','+ inputs[3] + ')='+ inputs[4] + '');
                }
                if (inputs[0] == 'query') {
                    var sum = CubeSummation.query(inputs[1], inputs[2], inputs[3], inputs[4], inputs[5], inputs[6]);
                    term.echo('\t result:' + sum);
                }

                ApplicationControl.operationUsed();
                if(ApplicationControl.getOperationsLeft() === 0){
                  ApplicationControl.current_operation = 0;
                  term.pop();
                  term.echo('no operations left');
                  ApplicationControl.testUsed();
                  if(ApplicationControl.getTestLeft() ===0){
                    term.echo('no test-cases left');

                    term.echo('');
                    term.echo('');
                    term.echo('');

                    term.echo("\ttype [[gi;green;black]begin] to start application or [[gi;green;black]unit_test] to see QUnit test");

                    return ;
                  }
                  term.exec('step1', true);
                }
                term.set_prompt(ApplicationControl.getOperationsLeft() + '>');

            }, {
                prompt: ApplicationControl.getOperationsLeft() + '>'
            });
        },
        begin: function() {
            this.exec('step0', true);
        }


    }, {
        greetings: 'grability backend developer test, phase 1',
        name: 'grability-codechallenge',
        prompt: '>',
        onInit: function(term) {
            term.echo("\ttype [[gi;green;black]begin] to start application or [[gi;green;black]unit_test] to see QUnit test");

        }
    });
});



var ApplicationControl = {
    N: 0,
    T: 0,
    M: 0,
    current_operation: 0,
    current_test: 0,
    getOperationsLeft: function() {
        return this.M - this.current_operation;
    },
    operationUsed: function() {
        this.current_operation++;
    },
    getTestLeft: function() {
        return this.T - this.current_test;
    },
    testUsed: function() {
        this.current_test++;
    },
    validateT: function(T) {
        T = parseInt(T);
        return !isNaN(T) && T >= 1 && T <= 50;
    },
    validateN: function(N) {
        N = parseInt(N);
        return !isNaN(N) && N >= 1 && N <= 100;
    },
    validateM: function(M) {
        M = parseInt(M);
        return !isNaN(M) && M >= 1 && M <= 100;
    }
};

var CubeSummation = {
    test_cases: 0,
    matrix: [],
    init: function(N) {
        ApplicationControl.N = N;
        this.matrix = [];
        for (var x = 0; x <= N; x++) {
            var array = [];
            for (var y = 0; y <= N; y++) {
                var internal = [];
                for (var z = 0; z <= N; z++) {
                    internal.push(0);
                }
                array.push(internal);
            }
            this.matrix.push(array);
        }
    },
    update: function(x, y, z, W) {
        if (!(1 <= x && x <= ApplicationControl.N && 1 <= y && y <= ApplicationControl.N && 1 <= z && z <= ApplicationControl.N)) {
            throw Error('Invalid operation');
        }
        this.matrix[x][y][z] = W;
    },
    query: function(x1, y1, z1, x2, y2, z2) {

        if (!(1 <= x1 && x1 <= x2 && x2 <= ApplicationControl.N && 1 <= y1 && y1 <= y2 && y2 <= ApplicationControl.N && 1 <= z1 && z1 <= z2 && z2 <= ApplicationControl.N)) {
            throw Error('Invalid operation');
        }


        var sum = 0;

        for (var i = x1; i <= x2; i++) {
            for (var j = y1; j <= y2; j++) {
                for (var k = z1; k <= z2; k++) {
                    sum += this.matrix[i][j][k];
                }
            }
        }
        return sum;
    },

};


/*******************************
 ************UNIT TEST************
 *******************************/

QUnit.test("https://www.hackerrank.com/challenges/cube-summation Test", function(assert) {

    var CubeSummationTest = jQuery.extend({},CubeSummation);
    CubeSummationTest.init(4);
    CubeSummationTest.update(2, 2, 2, 4);
    var sum_test = CubeSummationTest.query(1, 1, 1, 3, 3, 3);
    assert.equal(sum_test,4);

    CubeSummationTest.update(1, 1, 1, 23);
    sum_test = CubeSummationTest.query(2, 2, 2, 4, 4, 4);
    assert.equal(sum_test,4);

    sum_test = CubeSummationTest.query(1, 1, 1, 3, 3, 3);
    assert.equal(sum_test,27);

});
