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

const erf = require("compute-erf");
const erfinv = require("compute-erfinv");

// When we sum subtask estimates, we eschew the best and worst estimates
// in favor of either subtracting or adding three standard deviations
// from the mean. Summing means is very straightforward, but summing
// standard deviations is not.
//
// For example, when performing ten tasks, each with a best-case
// estimate of one hour, the odds of performing all ten in ten hours is
// far lower than the odds of performing one of them in one hour.
//
// The more subtasks we sum, the more we want to narrow our field. This
// function will precisely return the number of sigmas we should add or
// subtract from the mean, given a count of subtasks we are summing.

const erf3 = erf(1.5);
module.exports = n => erfinv(Math.pow(erf3, n)) * 2;
