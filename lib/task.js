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

let createEmptyIterator = function() {
  result = {};
  result[Symbol.iterator] = function*() {};
  return result;
};

module.exports = function() {
  let best, expected, worst, isDone, description, children, tomatoes,
    calcBest, calcExpected, calcWorst, calc6Te, calc6sigma,
    setDescription, setEstimateFromArray;

  calcBest = function() {
    if (children.length === 0) {
      return undefined;

    } else if (children.length === 1) {
      return children[0].getBest();

    } else {
      return Math.ceil((calc6Te() - calc6sigma()) / 6);
    }
  };

  calcExpected = function() {
    if (children.length === 0) {
      return undefined;

    } else {
      let result = 0;
      for (child of children) {
        result += child.getExpected();
      }
      return result;
    }
  };

  calcWorst = function() {
    if (children.length === 0) {
      return undefined;

    } else if (children.length === 1) {
      return children[0].getWorst();

    } else {
      return Math.ceil((calc6Te() + calc6sigma()) / 6);
    }
  };

  calc6Te = function() {
    let result = 0;

    for (child of children) {
      result += child.get6Te();
    }

    return result;
  };

  calc6sigma = function() {
    let result = 0;

    for (child of children) {
      result += child.get6sigma();
    }

    return result;
  };

  setDescription = function(value) {
    description = value || '';
  };

  setEstimateFromArray = function(a) {
    best = a[0];
    expected = a[1];
    worst = a[2];
  };

  isDone = false;
  children = [];
  tomatoes = [];

  switch(arguments.length) {
    case 0:
      setDescription();
      break;

    case 1:
      setDescription(arguments[0]);
      break;

    case 3:
      setDescription();
      setEstimateFromArray(arguments);
      break;

    case 4:
      setDescription(arguments[3]);
      setEstimateFromArray(arguments);
      break;

    default:
      throw "Expected 0, 1, 3, or 4 arguments";
  }

  return {
    'isDone': function() {
      return isDone;
    },

    'setDone': function() {
      isDone = true;
    },

    'setNotDone': function() {
      isDone = false;
    },

    'getBest': function() {
      return best || calcBest();
    },

    'getExpected': function() {
      return expected || calcExpected();
    },

    'getWorst': function() {
      return worst || calcWorst();
    },

    'setEstimate': function(b, e, w) {
      setEstimateFromArray([b, e, w]);
    },

    'getDescription': function() {
      return description;
    },

    'setDescription': setDescription,

    'getChildren': function() {
      return children;
    },

    'getChildrenLength': function() {
      return children.length;
    },

    'appendChild': function(childTask) {
      children.push(childTask);
    },

    'getTomatoes': function() {
      return tomatoes;
    },

    'getTomatoesLength': function() {
      return tomatoes.length;
    },

    'addTomato': function(tomato) {
      tomatoes.push(tomato);
    },

    'get6Te': function() {
      if (typeof worst === 'undefined') {
        return calc6Te();

      } else {
        return 4*expected + best + worst;
      }
    },

    'get6sigma': function() {
      if (typeof worst === 'undefined') {
        return calc6sigma();

      } else {
        return worst - best;
      }
    }
  };
};
