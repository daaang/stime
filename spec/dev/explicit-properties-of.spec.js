// stime: Estimates and Tomatoes
// Copyright 2018 Matt LaChance
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

describe("explicitPropertiesOf({})", () => {
  it("should iterate 0 times", () => {
    const iteration = explicitPropertiesOf({}).next();
    expect(iteration.value).to.equal(undefined);
    expect(iteration.done).to.equal(true);
  });
});

describe("explicitPropertiesOf({a: 1, b: 2})", () => {
  it("should contain 'a' and 'b'", () => {
    const keys = [];

    for (const key of explicitPropertiesOf({a: 1, b: 2}))
      keys.push(key);

    expect(keys).to.have.length(2);
    expect(keys).to.contain("a");
    expect(keys).to.contain("b");
  });
});
