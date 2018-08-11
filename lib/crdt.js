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
const uuidv4 = require("uuid/v4");

module.exports = function(uuid, value) {
  const crdt = {};
  const internal = {};

  internal.uuid = uuid;
  internal.value = value;
  internal.isModified = false;

  crdt.uuid = function() {
    return internal.uuid;
  };

  crdt.lastValue = function() {
    return internal.value;
  };

  crdt.isUndoable = function() {
    return internal.isModified;
  };

  crdt.update = function(newValue) {
    internal.value = newValue;
    internal.uuid = uuidv4();
    internal.isModified = true;
  };

  return crdt;
};
