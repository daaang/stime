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

  task.isComplete = function() {
    return internal.isComplete;
  };

  task.complete = function() {
    internal.isComplete = true;
  };

  task.incomplete = function() {
    internal.isComplete = false;
  };

  Object.defineProperty(task, "best", {
    get: function() {
      if (internal.bestIsExplicit())
        return internal.best;

      else if (internal.nominalIsExplicit())
        return internal.nominal;

      else if (internal.worstIsExplicit())
        return internal.worst;

      else
        return 0;
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
      if (internal.nominalIsExplicit())
        return internal.nominal;

      else if (internal.bestIsExplicit())
        return (internal.worstIsExplicit())
          ? internal.middle() : internal.best;

      else if (internal.worstIsExplicit())
        return internal.worst;

      else
        return 0;
    },

    set: function(x) {
      internal.nominal = x;

      if (internal.best > x)
        internal.best = null;

      if (internal.worst < x)
        internal.worst = null;
    }
  });

  Object.defineProperty(task, "worst", {
    get: function() {
      if (internal.worstIsExplicit())
        return internal.worst;

      else if (internal.nominalIsExplicit())
        return internal.nominal;

      else if (internal.bestIsExplicit())
        return internal.best;

      else
        return 0;
    },

    set: function(x) {
      internal.worst = x;

      if (internal.nominal > x)
        internal.nominal = null;

      if (internal.best > x)
        internal.best = null;
    }
  });

  internal.isComplete = false;

  internal.best = null;
  internal.nominal = null;
  internal.worst = null;

  internal.bestIsExplicit = function() {
    return (internal.best !== null);
  };

  internal.nominalIsExplicit = function() {
    return (internal.nominal !== null);
  };

  internal.worstIsExplicit = function() {
    return (internal.worst !== null);
  };

  internal.middle = function() {
    return (internal.best + internal.worst) / 2;
  };

  return task;
};
