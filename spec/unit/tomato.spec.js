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

  it("defaults to [Date.now(), '']", () => {
    let before = Date.now();
    let tomato = Tomato();
    let after = Date.now();

    expect(tomato.getDescription()).toBe("");
    expect(tomato.getTime()).toBeGreaterThan(before - 1);
    expect(tomato.getTime()).toBeLessThan(after + 1);
  });

  it("inits to [Date.now(), arg] with a single String arg", () => {
    let before = Date.now();
    let tomato = Tomato("holler");
    let after = Date.now();

    expect(tomato.getDescription()).toBe("holler");
    expect(tomato.getTime()).toBeGreaterThan(before - 1);
    expect(tomato.getTime()).toBeLessThan(after + 1);
  });

  it("inits to match a single Array arg", () => {
    let tomato = Tomato([112358, "imported description"]);

    expect(tomato.getTime()).toBe(112358);
    expect(tomato.getDescription()).toBe("imported description");
  });

  describe("#getTime", () => {
    it("returns the timestamp the tomato was inited with", () => {
      let tomato = Tomato([1234, "description"]);
      expect(tomato.getTime()).toBe(1234);
    });
  });

  describe("#getDescription", () => {
    it("returns the description the tomato was inited with", () => {
      let tomato = Tomato([1234, "description"]);
      expect(tomato.getDescription()).toBe("description");
    });
  });

  describe("#getJson", () => {
    it("returns the Array representing the tomato", () => {
      let tomato = Tomato([1234, "description"]);
      expect(tomato.getJson()).toEqual([1234, "description"]);
    });
  });
});
