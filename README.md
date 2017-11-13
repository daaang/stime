stime
=====

[![Travis CI Status][ci-state]][travis]
[![Test Coverage][cover-image]][coverage]

Based on a quick google translate, "stime" appears to be Italian for
"estimates." It's named as a nod to the [pomodoro technique][1].

**It's still in early development.** It doesn't do much.

The Goal
========

Eventually, I'd like this to be able to do four things:

1.  Store three-number task estimates in terms of tomatoes.
2.  Store tomatoes, knowing which tasks they were for.
3.  Report stats on recent estimate accuracy.
4.  Translate tomato estimates into realtime estimates based on recent
    frequency and on how much of my dev time I'm willing to spend on
    this particular task.

The fourth one is particularly important so that I can make my estimates
without needing to think about how much of my time I actually spend in
development but also so that I can *give* my estimates in units a
manager will understand (i.e. hours/days/weeks).

[1]: https://en.wikipedia.org/wiki/Pomodoro_Technique

[ci-state]:     https://travis-ci.org/daaang/stime.svg?branch=master
[travis]:       https://travis-ci.org/daaang/stime
[coverage]:     https://coveralls.io/github/daaang/stime
[cover-image]:  https://coveralls.io/repos/github/daaang/stime/badge.svg?branch=master
