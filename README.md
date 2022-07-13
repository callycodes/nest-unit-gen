oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g nest-unit-gen
$ nest-unit-gen COMMAND
running command...
$ nest-unit-gen (--version)
nest-unit-gen/1.0.0 darwin-x64 node-v17.8.0
$ nest-unit-gen --help [COMMAND]
USAGE
  $ nest-unit-gen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nest-unit-gen controllers DIRECTORY EXTENSION SERVICE`](#nest-unit-gen-controllers-directory-extension-service)
* [`nest-unit-gen help [COMMAND]`](#nest-unit-gen-help-command)
* [`nest-unit-gen plugins`](#nest-unit-gen-plugins)
* [`nest-unit-gen plugins:install PLUGIN...`](#nest-unit-gen-pluginsinstall-plugin)
* [`nest-unit-gen plugins:inspect PLUGIN...`](#nest-unit-gen-pluginsinspect-plugin)
* [`nest-unit-gen plugins:install PLUGIN...`](#nest-unit-gen-pluginsinstall-plugin-1)
* [`nest-unit-gen plugins:link PLUGIN`](#nest-unit-gen-pluginslink-plugin)
* [`nest-unit-gen plugins:uninstall PLUGIN...`](#nest-unit-gen-pluginsuninstall-plugin)
* [`nest-unit-gen plugins:uninstall PLUGIN...`](#nest-unit-gen-pluginsuninstall-plugin-1)
* [`nest-unit-gen plugins:uninstall PLUGIN...`](#nest-unit-gen-pluginsuninstall-plugin-2)
* [`nest-unit-gen plugins update`](#nest-unit-gen-plugins-update)

## `nest-unit-gen controllers DIRECTORY EXTENSION SERVICE`

Say hello

```
USAGE
  $ nest-unit-gen controllers [DIRECTORY] [EXTENSION] [SERVICE] [-o <value>]

ARGUMENTS
  DIRECTORY  Directory containing files to create unit tests for
  EXTENSION  Extension to create unit tests for
  SERVICE    Service name when starting up the app for tests

FLAGS
  -o, --overwrite=<value>  Overwrite existing spec files

DESCRIPTION
  Say hello

EXAMPLES
  $ nest-unit-gen controllers ./src/controllers .controller.ts service-core
```

_See code: [dist/commands/controllers/index.ts](https://github.com/nest-unit-gen/hello-world/blob/v1.0.0/dist/commands/controllers/index.ts)_

## `nest-unit-gen help [COMMAND]`

Display help for nest-unit-gen.

```
USAGE
  $ nest-unit-gen help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for nest-unit-gen.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `nest-unit-gen plugins`

List installed plugins.

```
USAGE
  $ nest-unit-gen plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ nest-unit-gen plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `nest-unit-gen plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nest-unit-gen plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ nest-unit-gen plugins add

EXAMPLES
  $ nest-unit-gen plugins:install myplugin 

  $ nest-unit-gen plugins:install https://github.com/someuser/someplugin

  $ nest-unit-gen plugins:install someuser/someplugin
```

## `nest-unit-gen plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ nest-unit-gen plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ nest-unit-gen plugins:inspect myplugin
```

## `nest-unit-gen plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nest-unit-gen plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ nest-unit-gen plugins add

EXAMPLES
  $ nest-unit-gen plugins:install myplugin 

  $ nest-unit-gen plugins:install https://github.com/someuser/someplugin

  $ nest-unit-gen plugins:install someuser/someplugin
```

## `nest-unit-gen plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ nest-unit-gen plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ nest-unit-gen plugins:link myplugin
```

## `nest-unit-gen plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nest-unit-gen plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nest-unit-gen plugins unlink
  $ nest-unit-gen plugins remove
```

## `nest-unit-gen plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nest-unit-gen plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nest-unit-gen plugins unlink
  $ nest-unit-gen plugins remove
```

## `nest-unit-gen plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nest-unit-gen plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nest-unit-gen plugins unlink
  $ nest-unit-gen plugins remove
```

## `nest-unit-gen plugins update`

Update installed plugins.

```
USAGE
  $ nest-unit-gen plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
