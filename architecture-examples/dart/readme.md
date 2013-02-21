# Dart • [TodoMVC](http://todomvc.com)

A TodoMVC sample built with Dart. It does not use a MVC framework - it's a Vanilla Dart sample.

Dart firstly targets the development of modern and large scale browser-side web apps. It's an object oriented language with a C-style syntax.

## Run

Dart compiles to JavaScript and thus runs across modern browsers. Dart also can run in its own virtual machine.

To edit and debug Dart, you can use Dart Editor. The editor ships with the [SDK](http://dartlang.org) and [Dartium](http://www.dartlang.org/dartium/), our version of Chromium with an embedded Dart VM.

? For testing purpose, dart/app.dart will run on any browser thanks to sdk/dart.js. First run will take time to process dart files.

## Compilation to JS

Dart SDK includes dart2js blahblah

dart2js -oapp.dart.js app.dart

minification ?

## Dart syntax analysis

[![Build Status](https://drone.io/mlorber/todomvc-dart/status.png)](https://drone.io/mlorber/todomvc-dart/latest)

Dart SDK is still under active development, and new releases include lots of breaking changes. The application is built by drone.io, which proposes a specific build trigger for Dart SDK updates.

dart_analyzer app.dart --fatal-type-errors --fatal-warnings

Build history can be seen [here](https://drone.io/mlorber/todomvc-dart)

## Credit

Made by [Mathieu Lorber](http://mlorber.net)
