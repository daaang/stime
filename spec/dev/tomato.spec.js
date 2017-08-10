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

describe('a default tomato object', function() {
  let currentTimeInMS = Date.now();
  let tomato = Tomato();

  it('is within 1 second of the current time', function() {
    let theTime = tomato.getTime()

    if (theTime > currentTimeInMS) {
      expect(theTime).toBeLessThan(currentTimeInMS + 1000);

    } else {
      expect(theTime).toBeGreaterThan(currentTimeInMS - 1000);
    }
  });

  it('has an empty description', function() {
    expect(tomato.getDescription()).toBe('');
  });

  it('has a json representation', function() {
    expect(tomato.getJson()).toEqual([tomato.getTime(),
                                       tomato.getDescription()]);
  });
});

describe('a tomato object with a description', function() {
  let currentTimeInMS = Date.now();
  let tomato = Tomato('writing tests');

  it('remembers its description', function() {
    expect(tomato.getDescription()).toBe('writing tests');
  });

  it('includes its description in its json output', function() {
    expect(tomato.getJson()[1]).toBe('writing tests');
  });
});

describe('a tomato object from a json array', function() {
  let tomato = Tomato([1234567891011, 'dreaming about tests'])

  it('remembers its description', function() {
    expect(tomato.getDescription()).toBe('dreaming about tests');
  });

  it('remembers its time', function() {
    expect(tomato.getTime()).toBe(1234567891011);
  });
});
