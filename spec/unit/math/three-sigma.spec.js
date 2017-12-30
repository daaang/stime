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

/* eslint-env mocha */
const expect = require("chai").expect;
const threeSigma = require("../../../lib/math/three-sigma");
const values = [3, 2.59, 2.34, 2.15, 2, 1.87, 1.76, 1.66, 1.57, 1.49];

describe("threeSigma()", function() {
  for (let i = 0; i < 10; i += 1)
    it("given " + (i + 1) + " returns " + values[i], function() {
      expect(threeSigma(i + 1)).to.be.closeTo(values[i], 0.01);
    });
});
