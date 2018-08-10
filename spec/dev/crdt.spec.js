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
const CRDT = require("../../lib/crdt");

let crdt;

describe("CRDT(0)", () => {
  beforeEach(() => {
    crdt = CRDT(0);
  });

  it("has a lastValue of 0", () => {
    expect(crdt.lastValue()).to.equal(0);
  });

  it("cannot be undone", () => {
    expect(crdt.isUndoable()).to.equal(false);
  });
});

describe("CRDT('a')", () => {
  beforeEach(() => {
    crdt = CRDT("a");
  });

  it("has a lastValue of 'a'", () => {
    expect(crdt.lastValue()).to.equal("a");
  });

  it("cannot be undone", () => {
    expect(crdt.isUndoable()).to.equal(false);
  });

  describe("after running crdt.update('b')", () => {
    beforeEach(() => {
      crdt.update("b");
    });

    it("has a lastValue of 'b'", () => {
      expect(crdt.lastValue()).to.equal("b");
    });
  });
});
