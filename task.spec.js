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

var Task = require('./task');

describe('a default task object', function() {
  task = Task();

  it('is not done', function() {
    expect(task.is_done()).toBe(false);
  });

  it('has no estimates', function() {
    expect(task.get_best()).toBeUndefined();
    expect(task.get_expected()).toBeUndefined();
    expect(task.get_worst()).toBeUndefined();
  });

  it('has a blank description', function() {
    expect(task.get_description()).toBe('');
  });
});
