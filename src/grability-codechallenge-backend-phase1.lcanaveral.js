var TERM;
jQuery(function($) {
    $('body').terminal({

        help: function() {
            this.echo("\tavailable commands are:");
        },

        unit_test: function() {
            $('#qunit').toggle();
        },
        step0: function() {
            this.echo('write the number(T) of test-cases');
            this.push(function(input, term) {
                var inputs = $.terminal.parseArguments(input);
                console.log('step0', arguments);
                if (ApplicationsContraints.validateT(inputs[0])) {
                    //CUBE_SUMMATION.T = T;
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
            this.echo('N would be the number of elements of each dimension');
            this.echo('M would be the number of operations for each test case');
            this.push(function(input, term) {
                var inputs = $.terminal.parseArguments(input);
                console.log('step1', arguments, inputs);

                if (!ApplicationsContraints.validateN(inputs[0])) {
                    term.echo('\tN must be a number between 1 to 100');
                } else if (!ApplicationsContraints.validateM(inputs[1])) {
                    term.echo('\tM must be a number between 1 to 1000');
                    return;
                }

                CubeSummation.init(inputs[0]);

                term.pop();
                term.exec('step2', true);


            }, {
                prompt: 'N M:'
            });
        },
        step2: function() {
            this.echo('setup ready');
        }


    }, {
        greetings: 'grability backend developer test, phase 1',
        name: 'grability-codechallenge',
        prompt: '>',
        onInit: function(term) {
            //term.exec('step0', true);
            TERM = term;
        }
    });
});

var CubeSummation = {
    test_cases: 0,
    matrix: [],
    N: 0,
    init: function(N) {
        this.N = N;
        this.matrix = [];
        for (var x = 0; x < N; x++) {
            var array = [];
            for (var y = 0; y < N; y++) {
                var internal = [];
                for (var z = 0; z < N; z++) {
                    internal.push(0);
                }
                array.push(internal);
            }
            this.matrix.push(array);
        }
    },
    update: function(x, y, z, w) {
      if(w > Math.pow(10,9) || w < -Math.pow(10,9) ){
          throw new Error('value must be between -10^9 <= W <= 10^9');
      }
      for (var z0 = z; z0 < this.N; z0 += z0 & (-z0)) {
          for (var y0 = y; y0 < this.N; y0 += y0 & (-y0)) {
              for (var x0 = x; x0 < this.N; x0 += x0 & (-x0)) {
                  this.matrix[x0][y0][z0] += w;
              }
          }
      }
    },
    query(x1, y1, z1, x2, y2, z2) {
        var left2right = this._sum(x2, y2, z2) - this._sum(x1 - 1, y2, z2) -
            this._sum(x2, y1 - 1, z2) + this._sum(x1 - 1, y1 - 1, z2);

        var right2left = this._sum(x2, y2, z1 - 1) - this._sum(x1 - 1, y2, z1 - 1) -
            this._sum(x2, y1 - 1, z1 - 1) + this._sum(x1 - 1, y1 - 1, z1 - 1);
        var result = left2right - right2left;
        
        return result;
    },
    _sum(x, y, z) {
        var sum = 0;
        for (var z1 = z; z1 > 0; z1 -= z1 & -z1) {
            for (var y1 = y; y1 > 0; y1 -= y1 & -y1) {
                for (var x1 = x; x1 > 0; x1 -= x1 & -x1) {
                    sum += this.matrix[x1][y1][z1];
                }
            }
        }
        return sum;
    }
};

var ApplicationsContraints = {
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


/*******************************
 ************UNIT TEST************
 *******************************/

 QUnit.test("Command C 20 4", function( assert ) {
   var CubeSummationTest = jQuery.extend({},CubeSummation);
   CubeSummation.init(4);
   CubeSummation.update(1, 1, 1, 4, 4);
   var sum_test = CubeSummation.query(1, 1, 1, 3, 3, 3);

   assert.equal(sum_test,4);

   CubeSummation.update(1, 1, 1, 23, 4);
   sum_test = CubeSummation.query(1, 1, 1, 3, 3, 3);

   assert.equal(sum_test,27);
 });
