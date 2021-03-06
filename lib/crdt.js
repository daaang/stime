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

const CRDT = function(uuid, value) {
  const crdt = {};
  const internal = {};

  internal.uuid = uuid;
  internal.value = value;

  internal.site = uuidv4();
  internal.isModified = false;
  internal.children = [];

  crdt.siteUUID = function() {
    return internal.site;
  };

  crdt.uuid = function() {
    return internal.uuid;
  };

  crdt.lastValue = function() {
    if (internal.thisIsTheCurrentNode())
      return internal.value;

    else
      return internal.lastChild().lastValue();
  };

  crdt.isUndoable = function() {
    return (!internal.thisIsTheCurrentNode());
  };

  crdt.changes = function(previousUUID) {
    const changesToUndo = [];
    const changesToMake = [];

    if (previousUUID !== internal.uuid)
      changesToMake.push(crdt.lastValue());

    return [changesToUndo, changesToMake];
  };

  crdt.undo = function() {
    if (internal.thisIsTheCurrentNode())
      return false;

    if (!internal.lastChild().undo())
      internal.uuid = uuid;

    return true;
  };

  crdt.update = function(newValue) {
    if (internal.thisIsTheCurrentNode())
      internal.children.push(CRDT(uuidv4(), newValue));

    else
      internal.lastChild().update(newValue);

    internal.uuid = internal.lastChild().uuid();
  };

  internal.thisIsTheCurrentNode = function() {
    return (internal.uuid === uuid);
  };

  internal.lastChild = function() {
    return internal.children[internal.children.length - 1];
  };

  return crdt;
};

module.exports = CRDT;
