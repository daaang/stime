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

module.exports = function(a, b, c, d) {
  const task = {};
  const internal = {};

  if (typeof a === "undefined") {
    task.description = "";

    internal.best = null;
    internal.nominal = null;
    internal.worst = null;
  } else if (typeof b === "undefined") {
    task.description = a;

    internal.best = null;
    internal.nominal = null;
    internal.worst = null;
  } else {
    task.description = d || "";

    if (a <= b && b <= c) {
      internal.best = a;
      internal.nominal = b;
      internal.worst = c;
    } else if (a > b) {
      throw Error("best case can't be larger than nominal");
    } else if (b > c) {
      throw Error("nominal can't be larger than worst case");
    } else {
      throw Error("invalid estimates");
    }
  }

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

      else if (internal.bestFromChildren())
        return internal.bestFromChildren();

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

      else if (internal.nominalFromChildren() > 0)
        return internal.nominalFromChildrenIfBetweenBestAndWorst();

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

      if (internal.worstFromChildren() > 0)
        return internal.worstFromChildrenIfLargerThanOthers();

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

  Object.defineProperty(task, "mean", { get: function() {
    return (task.best + 4 * task.nominal + task.worst) / 6;
  }});

  Object.defineProperty(task, "deviation", { get: function() {
    return (task.worst - task.best) / 6;
  }});

  internal.isComplete = false;

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
    return Math.ceil((internal.best + internal.worst) / 2);
  };

  internal.bestFromChildren = function() {
    if (task.subtasks.length === 0)
      return 0;

    else
      return task.subtasks[0].best;
  };

  internal.nominalFromChildren = function() {
    return task.subtasks.reduce((total, x) => x.nominal + total, 0);
  };

  internal.worstFromChildren = function() {
    if (task.subtasks.length === 0)
      return 0;

    else
      return task.subtasks[0].worst;
  };

  internal.nominalFromChildrenIfBetweenBestAndWorst = function() {
    if (internal.bestIsExplicit())
      return Math.max(internal.best, internal.nominalFromChildren());

    else if (internal.worstIsExplicit())
      return Math.min(internal.worst, internal.nominalFromChildren());

    else
      return internal.nominalFromChildren();
  };

  internal.worstFromChildrenIfLargerThanOthers = function() {
    if (internal.bestIsExplicit())
      return Math.max(internal.best, internal.worstFromChildren());

    else if (internal.nominalIsExplicit())
      return Math.max(internal.nominal, internal.worstFromChildren());

    else
      return internal.worstFromChildren();
  };

  return task;
};
