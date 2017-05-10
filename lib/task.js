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

var create_empty_iterator = function() {
  result = {};
  result[Symbol.iterator] = function*() {};
  return result;
};

module.exports = function() {
  var is_done = false;

  return {
    'is_done': function() {
      return is_done;
    },

    'set_done': function() {
      is_done = true;
    },

    'set_not_done': function() {},

    'get_description': function() {
      return '';
    },

    'get_best': function() {},
    'get_expected': function() {},
    'get_worst': function() {},

    'get_children': function() {
      return create_empty_iterator();
    },

    'get_children_length': function() {
      return 0;
    },

    'get_tomatoes': function() {
      return create_empty_iterator();
    },

    'get_tomatoes_length': function() {
      return 0;
    }
  };
};
