// stime: Estimates and Tomatoes
// Copyright 2018 Matt LaChance
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
const Task = require("./task");
const uuidv4 = require("uuid/v4");

module.exports = function(json) {
  const list = {};
  const internal = {};

  internal.tasks = new Map();
  internal.order = [];
  internal.uuid = uuidv4();

  if (typeof json !== "undefined") {
    if (typeof json.order !== "undefined")
      internal.order = json.order;

    for (const key in json.tasks)
      if (json.tasks.hasOwnProperty(key))
        internal.tasks.set(key, Task(json.tasks[key]));
  }

  internal.highestID = internal.order.reduce((a, b) => Math.max(a, b), 0);

  list.toJSON = function() {
    const tasks = {};

    for (const [key, value] of internal.tasks)
      tasks[key.toString()] = value;

    return {tasks: tasks, order: internal.order};
  };

  list.uuid = function() {
    return internal.uuid;
  };

  list.addTask = function(...args) {
    while (internal.tasks.has(internal.highestID))
      internal.highestID += 1;

    internal.order.push(internal.highestID);
    internal.tasks.set(internal.highestID, Task(...args));
  };

  return list;
};
