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

var Task = require('../lib/task');
var they = it; // for describing plural things

describe('a default task object', function() {
  var task;
  var it_has_no, it_can_get_an_estimate_of;

  beforeEach(function() {
    task = Task();
  });

  it('is not done', function() {
    expect(task.is_done()).toBe(false);
  });

  it_has_no = function(estimate) {
    it('has no '+estimate+' estimate', function() {
      expect(task['get_'+estimate]()).toBeUndefined();
    });
  };

  it_has_no('best');
  it_has_no('expected');
  it_has_no('worst');

  it('has a blank description', function() {
    expect(task.get_description()).toBe('');
  });

  it('has no child tasks', function() {
    expect(task.get_children_length()).toBe(0);
  });

  it('has an empty child task iterator', function() {
    expect(task.get_children()).toEqual([]);
  });

  it('has no tomatoes', function() {
    expect(task.get_tomatoes_length()).toBe(0);
  });

  it('has an empty tomato iterator', function() {
    expect(task.get_tomatoes()).toEqual([]);
  });

  it('has an average of zero', function() {
    expect(task.get_6Te()).toBe(0);
  });

  it('has a range of zero', function() {
    expect(task.get_6sigma()).toBe(0);
  });

  describe('when set as done', function() {
    beforeEach(function() {
      task.set_done();
    });

    it('is done', function() {
      expect(task.is_done()).toBe(true);
    });

    it('can be undone', function() {
      task.set_not_done();
      expect(task.is_done()).toBe(false);
    });
  });

  it_can_get_an_estimate_of = function(best, expected, worst) {
    var estimate_text = best.toString() + ', ' + expected.toString() +
                                          ', ' + worst.toString();

    var weighted_sum = 4*expected + best + worst;
    var range = worst - best;

    describe('when given an estimate of ['+estimate_text+']',
             function() {
      beforeEach(function() {
        task.set_estimate(best, expected, worst);
      });

      it('remembers its best estimate', function() {
        expect(task.get_best()).toBe(best);
      });

      it('remembers its expected estimate', function() {
        expect(task.get_expected()).toBe(expected);
      });

      it('remembers its worst estimate', function() {
        expect(task.get_worst()).toBe(worst);
      });

      it('has a 6Te of '+weighted_sum.toString(), function() {
        expect(task.get_6Te()).toBe(weighted_sum);
      });

      it('has a 6sigma of '+range.toString(), function() {
        expect(task.get_6sigma()).toBe(range);
      });

      describe('and then given a null estimate', function() {
        beforeEach(function() {
          task.set_estimate();
        });

        it_has_no('best');
        it_has_no('expected');
        it_has_no('worst');
      });
    });
  };

  it_can_get_an_estimate_of(1, 2, 3);
  it_can_get_an_estimate_of(2, 3, 8);

  describe('when given a description', function() {
    beforeEach(function() {
      task.set_description('wangjangle the jibbajabba');
    });

    it('remembers the description', function() {
      expect(task.get_description()).toBe('wangjangle the jibbajabba');
    });

    it('can be given a null description', function() {
      task.set_description()
      expect(task.get_description()).toBe('');
    });
  });

  describe('when loaded with a subtask', function() {
    beforeEach(function() {
      task.append_child(Task(1, 3, 7));
    });

    it("inherits its child's best estimate", function() {
      expect(task.get_best()).toBe(1);
    });

    it("inherits its child's expected estimate", function() {
      expect(task.get_expected()).toBe(3);
    });

    it("inherits its child's worst estimate", function() {
      expect(task.get_worst()).toBe(7);
    });

    it('has one child task', function() {
      expect(task.get_children_length()).toBe(1);
    });

    describe('and then loaded with a second subtask', function() {
      beforeEach(function() {
        task.append_child(Task(4, 5, 6));
      });

      xit("has an expected estimate summing its children's", function() {
        expect(task.get_expected()).toBe(8);
      });
    });
  });

  describe('when loaded with a different subtask', function() {
    beforeEach(function() {
      task.append_child(Task(2, 4, 8));
    });

    it("inherits its child's best estimate", function() {
      expect(task.get_best()).toBe(2);
    });

    it("inherits its child's expected estimate", function() {
      expect(task.get_expected()).toBe(4);
    });

    it("inherits its child's worst estimate", function() {
      expect(task.get_worst()).toBe(8);
    });
  });
});

describe('a task with an inital description', function() {
  var task;

  beforeEach(function() {
    task = Task('wow wow');
  });

  it('stores that description', function() {
    expect(task.get_description()).toBe('wow wow');
  });
});

describe('a task with an initial estimate of [2, 3, 5]', function() {
  var task, it_has_an_estimate;

  beforeEach(function() {
    task = Task(2, 3, 5);
  });

  it_has_an_estimate = function(name, value) {
    it('has a '+name+' estimate of '+value.toString(), function() {
      expect(task['get_'+name]()).toBe(value);
    });
  };

  it_has_an_estimate('best', 2);
  it_has_an_estimate('expected', 3);
  it_has_an_estimate('worst', 5);
});

describe('a task with an initial estimate and description', function() {
  var task;

  beforeEach(function() {
    task = Task(12, 18, 20, 'take a while');
  });

  it('stores its description', function() {
    expect(task.get_description()).toBe('take a while');
  });

  it('has the expected 6Te', function() {
    expect(task.get_6Te()).toBe(104);
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
