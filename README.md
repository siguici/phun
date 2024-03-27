# PHP 💙 Bun (Phun)

Phun offers a seamless PHP integration for JavaScript/TypeScript projects, powered by Bun.
It's a great choice, especially if you prefer PHP over JSX/TSX.

## 📋 Requirements

Ensure you have the following installed:

- [**PHP**](https://www.php.net/downloads): Required for executing PHP code.

- [**Bun**](https://bun.sh/docs/installation): Needed for efficient PHP subprocess execution.

## ⚡️Installation

To install Phun, execute the following command with [Bun](https://bun.sh):

```shell
bun add phun
```

## 🔧 Configuration

Configure Phun in your project by defining the files to import in [the Bun preload file](https://bun.sh/docs/runtime/bunfig#preload):

```typescript
import { setup } from "phun";

setup();
```

## 📖 Usage
Phun provides multiple ways to incorporate PHP code into your JavaScript/TypeScript projects.

### Rendering PHP Code

  You can render PHP code directly using the `render()` function:

  ```typescript
  import { render } from 'phun';

  const result = await render(`<?= "Hello, $name!" ?>`, { name: 'Sigui' });

  console.log(result); // Output: Hello, Sigui!
  ```

### Importing PHP Modules

  You can import and use PHP modules in your JavaScript/TypeScript projects:

  ```typescript
  import my_php_module from "my/php/module.php";

  console.log(my_php_module());
  ```

### Dynamic Using with Data

  You can pass data to PHP code for dynamic rendering using the `use()` function:

  ```typescript

  import { use } from "phun";

  const my_php_module = await use(import.meta.dir + '/my/php/module.php', { name: "Sigui", username: "siguici" });

  console.log(my_php_module);
```

## 👏 Contributions

Contributions are welcome! You can:

- **Open Issues**: Report bugs or suggest improvements.
  
- **Submit Pull Requests**: Contribute bug fixes, new features, or documentation enhancements.
  
- **Provide Feedback**: Share your thoughts and ideas to help improve Phun.

Let's collaborate and make Phun even more awesome together!

## 📄 License

This project is licensed under the MIT License. [See the LICENSE file for more details](./LICENSE.md).
