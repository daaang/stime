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

describe('a default task object', function() {
  var task;

  beforeEach(function() {
    task = Task();
  });

  it('is not done', function() {
    expect(task.is_done()).toBe(false);
  });

  var it_has_no = function(estimate) {
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
    expect(task.get_children()).toEqual([]);
  });

  it('has no tomatoes', function() {
    expect(task.get_tomatoes_length()).toBe(0);
    expect(task.get_tomatoes()).toEqual([]);
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

  describe('when given an estimate', function() {
    beforeEach(function() {
      task.set_estimate(1, 2, 3);
    });

    it('remembers its best estimate', function() {
      expect(task.get_best()).toBe(1);
    });
  });
});
