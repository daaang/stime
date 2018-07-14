// stime: Estimates and Tomatoes
// Copyright 2017-2018 Matt LaChance
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

const Task = function(a, b, c, d) {
  const task = {};
  task.subtasks = [];
  task.intervals = [];

  const internal = {};
  internal.isComplete = false;
  internal.best = null;
  internal.nominal = null;
  internal.worst = null;

  if (typeof a === "undefined") {
    // 0 arguments
    task.description = "";
  } else if (typeof b === "undefined") {
    if (typeof a === "string") {
      // 1 string argument
      task.description = a;
    } else {
      // 1 json argument
      const json = JSON.parse(JSON.stringify(a));

      task.description = json.description || "";

      if (typeof json.isComplete !== "undefined")
        internal.isComplete = json.isComplete;

      if (typeof json.estimates !== "undefined") {
        internal.best = json.estimates[0];
        internal.nominal = json.estimates[1];
        internal.worst = json.estimates[2];
      }

      if (typeof json.subtasks !== "undefined")
        for (const subtask of json.subtasks)
          task.subtasks.push(Task(subtask));
    }
  } else {
    // more than 1 argument
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

      else if (internal.bestFromChildren() > 0)
        return internal.bestFromChildrenIfSmallerThanOthers();

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
        return internal.nominalFromChildrenIfBetweenOthers();

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
    if (internal.anyAreExplicit())
      return (task.best + 4 * task.nominal + task.worst) / 6;

    else
      return internal.meanFromChildren();
  }});

  Object.defineProperty(task, "deviation", { get: function() {
    if (internal.anyAreExplicit())
      return (task.worst - task.best) / 6;

    else
      return internal.deviationFromChildren();
  }});

  task.toJSON = function() {
    const json = {isComplete: internal.isComplete};

    if (task.description !== "")
      json.description = task.description;

    if (internal.anyAreExplicit())
      json.estimates = [internal.best, internal.nominal, internal.worst];

    if (task.subtasks.length > 0)
      json.subtasks = task.subtasks;

    if (task.intervals.length > 0)
      json.intervals = task.intervals;

    return json;
  };

  internal.bestIsExplicit = function() {
    return (internal.best !== null);
  };

  internal.nominalIsExplicit = function() {
    return (internal.nominal !== null);
  };

  internal.worstIsExplicit = function() {
    return (internal.worst !== null);
  };

  internal.anyAreExplicit = function() {
    return (internal.bestIsExplicit()
            || internal.nominalIsExplicit()
            || internal.worstIsExplicit());
  };

  internal.middle = function() {
    return Math.ceil((internal.best + internal.worst) / 2);
  };

  internal.meanFromChildren = function() {
    return task.subtasks.reduce((total, x) => x.mean + total, 0);
  };

  internal.deviationFromChildren = function() {
    return Math.sqrt(task.subtasks.reduce(
      (total, x) => (x.deviation * x.deviation) + total, 0));
  };

  internal.bestFromChildren = function() {
    if (task.subtasks.length === 0)
      return 0;

    else if (task.subtasks.length === 1)
      return task.subtasks[0].best;

    else
      return Math.ceil(
        internal.meanFromChildren() - (3 * internal.deviationFromChildren()) - 0.15);
  };

  internal.nominalFromChildren = function() {
    return task.subtasks.reduce((total, x) => x.nominal + total, 0);
  };

  internal.worstFromChildren = function() {
    if (task.subtasks.length === 0)
      return 0;

    else if (task.subtasks.length === 1)
      return task.subtasks[0].worst;

    else
      return Math.ceil(
        internal.meanFromChildren() + (3 * internal.deviationFromChildren()) - 0.15);
  };

  internal.bestFromChildrenIfSmallerThanOthers = function() {
    if (internal.nominalIsExplicit())
      return Math.min(internal.nominal, internal.bestFromChildren());

    else if (internal.worstIsExplicit())
      return Math.min(internal.worst, internal.bestFromChildren());

    else
      return internal.bestFromChildren();
  };

  internal.nominalFromChildrenIfBetweenOthers = function() {
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

module.exports = Task;
