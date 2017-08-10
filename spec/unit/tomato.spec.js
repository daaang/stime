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

const Tomato = require('../../lib/tomato');

describe("Tomato", () => {
  describe("#get_time", () => {
    it("returns a timestamp", () => {
      expectReturnsCurrentDate(() => {
        return Tomato().get_time();
      });
    });

    it("returns the timestamp the tomato was inited with", () => {
      let tomato = Tomato([1234, "description"]);
      expect(tomato.get_time()).toBe(1234);
    });
  });
});

let expectReturnsCurrentDate = function(f) {
  let before = Date.now();
  let inBetween = f();
  let after = Date.now();

  expect(inBetween).toBeGreaterThan(before - 1);
  expect(inBetween).toBeLessThan(after + 1);
};
