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

  task.description = "";

  task.mean = 0;
  task.deviation = 0;

  task.subtasks = [];
  task.intervals = [];

  Object.defineProperty(task, "best", {
    get: function() {
      if (internal.noEstimatesAreSet())
        return 0;

      else if (internal.best === null)
        return internal.worst;

      else
        return internal.best;
    },
    set: function(x) {
      internal.best = x;

      if (internal.nominal < x)
        internal.nominal = null;

      if (internal.worst < x)
        internal.worst = null;
    }
  });

  Object.defineProperty(task, "nominal", {
    get: function() {
      if (internal.noEstimatesAreSet())
        return 0;

      else if (internal.nominal === null && internal.worst === null)
        return internal.best;

      else if (internal.nominal === null)
        return internal.worst;

      else
        return internal.nominal;
    },
    set: function(x) {
      internal.nominal = x;
    }
  });

  Object.defineProperty(task, "worst", {
    get: function() {
      if (internal.noEstimatesAreSet())
        return 0;

      else if (internal.worst === null && internal.nominal === null)
        return internal.best;

      else if (internal.worst === null)
        return internal.nominal;

      else
        return internal.worst;
    },
    set: function(x) {
      internal.worst = x;

      if (internal.nominal > x)
        internal.nominal = null;

      if (internal.best > x)
        internal.best = null;
    }
  });

  internal.best = null;
  internal.nominal = null;
  internal.worst = null;

  internal.noEstimatesAreSet = function() {
    return (internal.best === null
      && internal.nominal === null
      && internal.worst === null);
  };

  return task;
};
