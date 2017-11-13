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
const Tomato = require("../..").Tomato;

let tomato;

describe("a default Tomato() instance", () => {
  beforeEach(() => {
    tomato = Tomato();
  });

  it("stores an empty description", () => {
    expect(tomato.description).to.equal("");
  });

  it("assumes 25 minutes of working time", () => {
    expect(tomato.workTimeLength).to.equal(25 * 60 * 1000);
  });

  it("assumes 5 minutes of resting time", () => {
    expect(tomato.restTimeLength).to.equal(5 * 60 * 1000);
  });

  it("stores a current timestamp", () => {
    expect(tomato.startTime).to.be.closeTo(Date.now(), 50);
  });
});

describe("Tomato('reticulating splines')", () => {
  beforeEach(() => {
    tomato = Tomato("reticulating splines");
  });

  it("stores a description of 'reticulating splines'", () => {
    expect(tomato.description).to.equal("reticulating splines");
  });

  it("stores a current timestamp", () => {
    expect(tomato.startTime).to.be.closeTo(Date.now(), 50);
  });
});
