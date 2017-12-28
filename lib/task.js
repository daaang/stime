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

module.exports = function() {
  const task = {};
  const internal = {};

  internal.best = 0;
  internal.nominal = 0;
  internal.worst = 0;

  task.description = "";

  Object.defineProperty(task, "best", {
    get: function() {
      return internal.best;
    },
    set: function(x) {
      internal.best = x;
    }
  });

  Object.defineProperty(task, "nominal", {
    get: function() {
      return internal.nominal;
    }
  });

  Object.defineProperty(task, "worst", {
    get: function() {
      return internal.worst;
    }
  });

  task.mean = 0;
  task.deviation = 0;

  task.subtasks = [];
  task.intervals = [];

  return task;
};
