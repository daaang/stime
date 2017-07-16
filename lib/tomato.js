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

let is_an_array = function(value) {
  return Object.prototype.toString.apply(value) === '[object Array]';
};

module.exports = function(input_value) {
  let internal = {};

  if (is_an_array(input_value)) {
    internal.current_time_in_ms = input_value[0]
    internal.description = input_value[1]

  } else {
    internal.current_time_in_ms = Date.now();
    internal.description = input_value || '';
  }

  return {
    'get_description': function() {
      return internal.description;
    },

    'get_time': function() {
      return internal.current_time_in_ms;
    },

    'get_json': function() {
      return [internal.current_time_in_ms, internal.description];
    }
  };
};
