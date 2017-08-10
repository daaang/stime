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

let isAnArray = function(value) {
  return Object.prototype.toString.apply(value) === '[object Array]';
};

module.exports = function(inputValue) {
  let internal = {};
  let tomato = {};

  if (isAnArray(inputValue)) {
    internal.currentTimeInMS = inputValue[0]
    internal.description = inputValue[1]

  } else {
    internal.currentTimeInMS = Date.now();
    internal.description = inputValue || '';
  }

  tomato.getDescription = function() {
    return internal.description;
  };

  tomato.getTime = function() {
    return internal.currentTimeInMS;
  };

  tomato.getJson = function() {
    return [internal.currentTimeInMS, internal.description];
  };

  return tomato;
};
