// stime: Estimates and Tomatoes
// Copyright 2018-2019 Matt LaChance
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
const explicitPropertiesOf = require("../../lib/explicit-properties-of");

const itHasKeys = function(keys) {
  it("has keys " + JSON.stringify(keys), function() {
    const actual = [];

    for (const i of explicitPropertiesOf(obj))
      actual.push(i);

    expect(actual).to.have.members(keys);
  });
};

let obj;

describe("an empty object", () => {
  beforeEach(() => {
    obj = {};
  });

  itHasKeys([]);

  describe("when prototyped with {a: 1, b: 2}", () => {
    beforeEach(() => {
      Object.setPrototypeOf(obj, { a: 1, b: 2 });
    });

    itHasKeys([]);

    describe("when given {c: 3}", () => {
      beforeEach(() => {
        obj.c = 3;
      });

      itHasKeys(["c"]);
    });
  });
});

describe("{a: 1, b: 2}", () => {
  beforeEach(() => {
    obj = { a: 1, b: 2 };
  });

  itHasKeys(["a", "b"]);
});
