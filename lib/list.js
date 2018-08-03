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
const explicitPropertiesOf = require("./explicit-properties-of");
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

    if (typeof json.uuid !== "undefined")
      internal.uuid = json.uuid;

    for (const key of explicitPropertiesOf(json.tasks))
      internal.tasks.set(key, Task(json.tasks[key]));
  }

  internal.serverUUID = internal.uuid;
  internal.highestID = internal.order.reduce((a, b) => Math.max(a, b), 0);
  internal.changes = [];
  internal.undone = [];

  list.toJSON = function() {
    const tasks = {};

    for (const [key, value] of internal.tasks)
      tasks[key.toString()] = value;

    return {
      uuid: internal.uuid,
      tasks: tasks,
      order: internal.order
    };
  };

  list.uuid = function() {
    return internal.uuid;
  };

  list.undo = function() {
    internal.undoChange(internal.changes.pop());
    return true;
  };

  list.redo = function() {
    internal.makeChange(internal.undone.pop());
    return true;
  };

  list.syncWithServer = function() {
    return [
      internal.serverUUID,
      internal.uuid,
      internal.changes.map(x => x[1])
    ];
  };

  list.applyServerResponse = function() {
    internal.changes = [];
    internal.serverUUID = internal.uuid;
  };

  list.addTask = function(...args) {
    while (internal.tasks.has(internal.highestID))
      internal.highestID += 1;

    internal.makeChange(["addTask", internal.highestID, args]);
  };

  internal.makeChange = function(change) {
    switch (change[0]) {
    case "addTask":
      const id = change[1];
      const args = change[2];

      internal.order.push(id);
      internal.tasks.set(id, Task(...args));
      break;
    }

    internal.changes.push([internal.uuid, change]);
    internal.uuid = uuidv4();
  };

  internal.undoChange = function(change) {
    switch (change[1][0]) {
    case "addTask":
      const id = change[1][1];

      internal.order.splice(internal.order.indexOf(id), 1);
      internal.tasks.delete(id);
      break;
    }

    internal.uuid = change[0];
    internal.undone.push(change[1]);
  };

  return list;
};
