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

  internal.nextID = internal.order.reduce((a, b) => Math.max(a, b), 0);
  internal.serverUUID = internal.uuid;
  internal.changes = [];
  internal.serverIndex = 0;
  internal.currentIndex = 0;

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
    if (internal.currentIndex === 0)
      return false;

    internal.currentIndex -= 1;
    internal.undoChange(internal.changes[internal.currentIndex]);
    return true;
  };

  list.redo = function() {
    if (internal.currentIndex === internal.changes.length)
      return false;

    internal.makeChange(internal.changes[internal.currentIndex]);
    internal.currentIndex += 1;
    return true;
  };

  list.syncWithServer = function() {
    return [
      internal.serverUUID,
      internal.uuid,
      internal.changes.slice(internal.serverIndex,
                             internal.currentIndex).map(x => x[1])
    ];
  };

  list.applyServerResponse = function(response) {
    const currentServer = response[1];

    internal.serverUUID = currentServer;

    if (internal.uuid === internal.serverUUID) {
      // The server is caught up.
      internal.serverIndex = internal.changes.length;
    } else {
      // The server is behind us.
      internal.serverIndex = internal.changes.length - 1;

      while (internal.changes[internal.serverIndex][0]
             !== internal.serverUUID)
        internal.serverIndex -= 1;
    }
  };

  list.addTask = function(...args) {
    internal.shiftID();
    internal.makeNewChange(["addTask", internal.nextID, args]);
  };

  internal.shiftID = function() {
    while (!internal.tasks.has(internal.nextID)
           && internal.nextID > 0)
      internal.nextID -= 1;

    while (internal.tasks.has(internal.nextID))
      internal.nextID += 1;
  };

  internal.makeNewChange = function(change) {
    internal.changes.splice(internal.currentIndex);
    internal.changes.push([internal.uuid, change]);

    internal.makeChange(internal.changes[internal.currentIndex]);

    internal.uuid = uuidv4();
    internal.currentIndex += 1;
  };

  internal.makeChange = function(change) {
    switch (change[1][0]) {
    case "addTask":
      const addID = change[1][1];
      const addArgs = change[1][2];

      internal.order.push(addID);
      internal.tasks.set(addID, Task(...addArgs));
      break;

    case "removeTask":
      const removeID = change[1][1];

      internal.order.splice(internal.order.indexOf(removeID), 1);
      internal.tasks.delete(removeID);
      break;
    }
  };

  internal.undoChange = function(change) {
    const [uuid, changeObj] = change;

    switch (changeObj[0]) {
    case "addTask":
      internal.makeChange([uuid, ["removeTask", changeObj[1]]]);
      break;
    }

    internal.uuid = uuid;
  };

  return list;
};
