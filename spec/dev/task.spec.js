// stime: Estimates and Tomatoes
// Copyright 2017 Matt LaChance
//
// This file is part of stime.
//
// stime is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, either version 3 of the License, or (at
// your option) any later version.
//
// stime is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
// for more details.
//
// You should have received a copy of the GNU General Public License
// along with stime. If not, see <http://www.gnu.org/licenses/>.

var Task = require('../../lib/task');
var Tomato = require('../../lib/tomato');
var they = it; // for describing plural things

describe('a default task object', function() {
  var task;
  var itHasNo, itCanGetAnEstimateOf;

  beforeEach(function() {
    task = Task();
  });

  it('is not done', function() {
    expect(task.isDone()).toBe(false);
  });

  itHasNo = function(estimate) {
    it('has no '+estimate+' estimate', function() {
      expect(task['get'+estimate]()).toBeUndefined();
    });
  };

  itHasNo('Best');
  itHasNo('Expected');
  itHasNo('Worst');

  it('has a blank description', function() {
    expect(task.getDescription()).toBe('');
  });

  it('has no child tasks', function() {
    expect(task.getChildrenLength()).toBe(0);
  });

  it('has an empty child task iterator', function() {
    expect(task.getChildren()).toEqual([]);
  });

  it('has no tomatoes', function() {
    expect(task.getTomatoesLength()).toBe(0);
  });

  it('has an empty tomato iterator', function() {
    expect(task.getTomatoes()).toEqual([]);
  });

  it('has an average of zero', function() {
    expect(task.get6Te()).toBe(0);
  });

  it('has a range of zero', function() {
    expect(task.get6sigma()).toBe(0);
  });

  describe('when set as done', function() {
    beforeEach(function() {
      task.setDone();
    });

    it('is done', function() {
      expect(task.isDone()).toBe(true);
    });

    it('can be undone', function() {
      task.setNotDone();
      expect(task.isDone()).toBe(false);
    });
  });

  itCanGetAnEstimateOf = function(best, expected, worst) {
    var estimateText = best.toString() + ', ' + expected.toString() +
                                          ', ' + worst.toString();

    var weightedSum = 4*expected + best + worst;
    var range = worst - best;

    describe('when given an estimate of ['+estimateText+']',
             function() {
      beforeEach(function() {
        task.setEstimate(best, expected, worst);
      });

      it('remembers its best estimate', function() {
        expect(task.getBest()).toBe(best);
      });

      it('remembers its expected estimate', function() {
        expect(task.getExpected()).toBe(expected);
      });

      it('remembers its worst estimate', function() {
        expect(task.getWorst()).toBe(worst);
      });

      it('has a 6Te of '+weightedSum.toString(), function() {
        expect(task.get6Te()).toBe(weightedSum);
      });

      it('has a 6sigma of '+range.toString(), function() {
        expect(task.get6sigma()).toBe(range);
      });

      describe('and then given a null estimate', function() {
        beforeEach(function() {
          task.setEstimate();
        });

        itHasNo('Best');
        itHasNo('Expected');
        itHasNo('Worst');
      });
    });
  };

  itCanGetAnEstimateOf(1, 2, 3);
  itCanGetAnEstimateOf(2, 3, 8);

  describe('when given a description', function() {
    beforeEach(function() {
      task.setDescription('wangjangle the jibbajabba');
    });

    it('remembers the description', function() {
      expect(task.getDescription()).toBe('wangjangle the jibbajabba');
    });

    it('can be given a null description', function() {
      task.setDescription()
      expect(task.getDescription()).toBe('');
    });
  });

  describe('when loaded with a subtask', function() {
    beforeEach(function() {
      task.appendChild(Task(1, 3, 7));
    });

    it("inherits its child's best estimate", function() {
      expect(task.getBest()).toBe(1);
    });

    it("inherits its child's expected estimate", function() {
      expect(task.getExpected()).toBe(3);
    });

    it("inherits its child's worst estimate", function() {
      expect(task.getWorst()).toBe(7);
    });

    it('has one child task', function() {
      expect(task.getChildrenLength()).toBe(1);
    });

    it('has an iterator with that child', function() {
      expect(task.getChildren()[0].get6Te()).toBe(20);
    });

    describe('and then loaded with a second subtask', function() {
      beforeEach(function() {
        task.appendChild(Task(4, 5, 6));
      });

      it("has an expected estimate summing its children's", function() {
        expect(task.getExpected()).toBe(8);
      });

      it('has a 6Te summing that of its children', function() {
        expect(task.get6Te()).toBe(50);
      });

      it('has a 6sigma summing that of its children', function() {
        expect(task.get6sigma()).toBe(8);
      });

      it('has a best estimate based on its Te and sigma', function() {
        expect(task.getBest()).toBe(7);
      });

      it('has a worst estimate based on its Te and sigma', function() {
        expect(task.getWorst()).toBe(10);
      });

      describe('and then loaded with a third subtask', function() {
        beforeEach(function() {
          task.appendChild(Task(1, 2, 20));
        });

        it('has an increase of 29 in its 6Te', function() {
          expect(task.get6Te()).toBe(79);
        });

        it('has an increase of 19 in its 6sigma', function() {
          expect(task.get6sigma()).toBe(27);
        });

        it('has a best estimate of 9', function() {
          expect(task.getBest()).toBe(9);
        });

        it('has an expected estimate of 10', function() {
          expect(task.getExpected()).toBe(10);
        });

        it('has a worst estimate of 18', function() {
          expect(task.getWorst()).toBe(18);
        });
      });
    });
  });

  describe('when loaded with a different subtask', function() {
    beforeEach(function() {
      task.appendChild(Task(2, 4, 8));
    });

    it("inherits its child's best estimate", function() {
      expect(task.getBest()).toBe(2);
    });

    it("inherits its child's expected estimate", function() {
      expect(task.getExpected()).toBe(4);
    });

    it("inherits its child's worst estimate", function() {
      expect(task.getWorst()).toBe(8);
    });
  });

  describe('when loaded with a tomato', function() {
    beforeEach(function() {
      task.addTomato(Tomato('first tomato'));
    });

    it('has one tomato', function() {
      expect(task.getTomatoesLength()).toBe(1);
    });

    it('keeps a copy of the tomato', function() {
      expect(task.getTomatoes()[0].getDescription()).toBe(
        'first tomato');
    });

    describe('and then loaded with a second tomato', function() {
      beforeEach(function() {
        task.addTomato(Tomato('second tomato'));
      });

      it('has two tomatoes', function() {
        expect(task.getTomatoesLength()).toBe(2);
      });

      it('keeps a copy of the first tomato', function() {
        expect(task.getTomatoes()[0].getDescription()).toBe(
          'first tomato');
      });

      it('keeps a copy of the second tomato', function() {
        expect(task.getTomatoes()[1].getDescription()).toBe(
          'second tomato');
      });
    });
  });
});

describe('a task with an inital description', function() {
  var task;

  beforeEach(function() {
    task = Task('wow wow');
  });

  it('stores that description', function() {
    expect(task.getDescription()).toBe('wow wow');
  });
});

describe('a task with an initial estimate of [2, 3, 5]', function() {
  var task, itHasAnEstimate;

  beforeEach(function() {
    task = Task(2, 3, 5);
  });

  itHasAnEstimate = function(name, value) {
    it('has a '+name+' estimate of '+value.toString(), function() {
      expect(task['get'+name]()).toBe(value);
    });
  };

  itHasAnEstimate('Best', 2);
  itHasAnEstimate('Expected', 3);
  itHasAnEstimate('Worst', 5);
});

describe('a task with an initial estimate and description', function() {
  var task;

  beforeEach(function() {
    task = Task(12, 18, 20, 'take a while');
  });

  it('stores its description', function() {
    expect(task.getDescription()).toBe('take a while');
  });

  it('has the expected 6Te', function() {
    expect(task.get6Te()).toBe(104);
  });
});

describe('new tasks', function() {
  they('cannot start with 2 arguments', function() {
    expect(function() {
      var task = Task(1, 2);
    }).toThrow();
  });

  they('cannot start with 5 arguments', function() {
    expect(function() {
      var task = Task(1, 2, 3, 4, 5);
    }).toThrow();
  });
});
