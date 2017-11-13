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

module.exports = function(...args) {
  let tomato = {};
  let input;

  if (isJustOneString(args))
    input = {description: args[0]};

  else if (args.length === 1)
    input = args[0];

  else
    input = {};

  let {
    description = "",
    startTime = Date.now(),
    restTimeLength = 5 * 60 * 1000,
    workTimeLength = 25 * 60 * 1000
  } = input;

  tomato.description = description;
  tomato.startTime = startTime;
  tomato.restTimeLength = restTimeLength;
  tomato.workTimeLength = workTimeLength;

  return tomato;
};

const isJustOneString = a => (a.length === 1 && isString(a[0]));

const isString = x => (typeof x === "string" || x instanceof String);
