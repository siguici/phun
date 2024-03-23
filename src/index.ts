import { plugin, which } from "bun";

export async function use(
  path: string,
  data: object = {},
  env = Bun.env,
): Promise<object> {
  const file = Bun.file(path);
  if (!file.exists()) {
    throw new Error(`No such file ${path}`);
  }

  const php = which("php");
  if (!php) {
    throw new Error("Cannot find PHP in your PATH");
  }

  const json = JSON.stringify(data);
  const { success, stdout, stderr } = Bun.spawnSync([
    "php",
    "-r",
    `$data = json_decode('${json}', true); if(is_array($data) && !\\array_is_list($data)) extract($data); ob_start(); $default = require "${path}"; if($default === 1) $default = ob_get_clean(); else ob_end_clean(); echo json_encode($default);`,
  ]);
  if (!success) {
    throw new Error(`Failed to run ${path}: ${stderr.toString()}`);
  }

  const result = stdout.toString();
  return JSON.parse(result);
}

export function register(name = "PHP Loader", filter: RegExp = /\.php$/): void {
  plugin({
    name,
    async setup(build) {
      build.onLoad({ filter }, async ({ path }) => {
        const result = await use(path);
        const exports =
          typeof result === "object" ? result : { default: result };
        return {
          exports,
          loader: "object",
        };
      });
    },
  });
}
