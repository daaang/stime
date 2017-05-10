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

module.exports = function() {
  return {
    'is_done': function() {
      return false;
    },

    'get_description': function() {
      return '';
    },

    'get_best': function() {},
    'get_expected': function() {},
    'get_worst': function() {},

    'get_children': function() {
      result = {};
      result[Symbol.iterator] = function*() {};
      return result;
    }
  };
};
