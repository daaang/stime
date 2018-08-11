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

describe("CRDT('abcd', 0)", () => {
  beforeEach(() => {
    crdt = CRDT("abcd", 0);
  });

  it("has a lastValue of 0", () => {
    expect(crdt.lastValue()).to.equal(0);
  });

  it("cannot be undone", () => {
    expect(crdt.isUndoable()).to.equal(false);
  });
});

describe("CRDT('uuidA', 'a')", () => {
  let siteUUID;

  beforeEach(() => {
    crdt = CRDT("uuidA", "a");
    siteUUID = crdt.siteUUID();
  });

  it("has a lastValue of 'a'", () => {
    expect(crdt.lastValue()).to.equal("a");
  });

  it("cannot be undone", () => {
    expect(crdt.isUndoable()).to.equal(false);
  });

  it("returns the same uuid every time", () => {
    expect(crdt.uuid()).to.equal("uuidA");
  });

  it("returns the same site uuid every time", () => {
    expect(crdt.siteUUID()).to.equal(siteUUID);
  });

  it("has a different site uuid from any different CRDT()", () => {
    expect(crdt.siteUUID()).not.to.equal(CRDT("", "").siteUUID());
  });

  describe("after running crdt.update('b')", () => {
    beforeEach(() => {
      crdt.update("b");
    });

    it("has a lastValue of 'b'", () => {
      expect(crdt.lastValue()).to.equal("b");
    });

    it("can be undone", () => {
      expect(crdt.isUndoable()).to.equal(true);
    });

    it("has a new uuid", () => {
      expect(crdt.uuid()).not.to.equal("uuidA");
    });

    it("doesn't change its site uuid", () => {
      expect(crdt.siteUUID()).to.equal(siteUUID);
    });
  });
});
