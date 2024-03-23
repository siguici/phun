# PHP 💙 Bun (Phun)

Phun allows you to easily import and execute PHP file from your JavaScript/TypeScript modules, leveraging the power of Bun.

## Installation

To install Phun, execute the following command with [Bun](https://bun.sh):

```shell
bun add phun
```

## Configuration

Configure Phun in your project by defining the files to import in [the Bun preload file](https://bun.sh/docs/runtime/bunfig#preload):

```typescript
import { register } from "phun";

register();
```

## Usage

Here's how to use phun in your project:

```typescript
import my_php_module from "my/php/module.php";

console.log(my_php_module());

// Or

import { use } from "phun";

const my_php_module = await use(import.meta.dir + '/my/php/module.php', {name: "Sigui", username: "siguici"});
```
