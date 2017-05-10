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

var is_an_object = function(value) {
  return (typeof value === 'object')
};

module.exports = function(input_value) {
  var current_time_in_ms, description;

  if (is_an_object(input_value)) {
    current_time_in_ms = input_value[0]
    description = input_value[1]

  } else {
    current_time_in_ms = Date.now();
    description = input_value || '';
  }

  return {
    'get_description': function() {
      return description;
    },

    'get_time': function() {
      return current_time_in_ms;
    },

    'get_json': function() {
      return [current_time_in_ms, description];
    }
  };
};
