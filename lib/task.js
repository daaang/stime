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
  var best, expected, worst, is_done, description,
    set_description, set_estimate_from_array;

  set_description = function(value) {
    description = value || '';
  };

  set_estimate_from_array = function(a) {
    best = a[0];
    expected = a[1];
    worst = a[2];
  };

  is_done = false;

  switch(arguments.length) {
    case 0:
      set_description();
      break;

    case 1:
      set_description(arguments[0]);
      break;

    case 3:
      set_description();
      set_estimate_from_array(arguments);
      break;
  }

  return {
    'is_done': function() {
      return is_done;
    },

    'set_done': function() {
      is_done = true;
    },

    'set_not_done': function() {
      is_done = false;
    },

    'get_best': function() {
      return best;
    },

    'get_expected': function() {
      return expected;
    },

    'get_worst': function() {
      return worst;
    },

    'set_estimate': function(b, e, w) {
      best = b;
      expected = e;
      worst = w;
    },

    'get_description': function() {
      return description;
    },

    'set_description': set_description,

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
    },

    'get_6Te': function() {
      if (typeof worst === 'undefined') {
        return 0;

      } else {
        return 4*expected + best + worst;
      }
    },

    'get_6sigma': function() {
      if (typeof worst === 'undefined') {
        return 0;

      } else {
        return worst - best;
      }
    }
  };
};
