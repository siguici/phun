import { unlinkSync } from "node:fs";
import { type Cwd, type Env, register as boss_register, load } from "boss.sh";

export type Data = Record<string, any>;

export async function render(
  code: string,
  data?: Data,
  cwd?: Cwd,
  env?: Env,
): Promise<any> {
  const path = `${process.cwd()}/phun-${Date.now()}-${Math.random()
    .toString(36)
    .split(".")
    .pop()}.php`;
  Bun.write(path, code);
  const render = await use(path, data, cwd, env);
  unlinkSync(path);
  return render;
}

export async function use(
  path: string,
  data?: Data,
  cwd?: Cwd,
  env?: Env,
): Promise<any> {
  const json = JSON.stringify(data ?? {});

  return await load(
    path,
    [
      "php",
      "-r",
      `$data = json_decode('${json}', true); if(is_array($data) && !\\array_is_list($data)) extract($data); ob_start(); $default = require "${path}"; if($default === 1) $default = ob_get_clean(); else ob_end_clean(); echo json_encode($default);`,
    ],
    cwd,
    env,
  );
}

export function register(
  name = "PHP Loader",
  filter: RegExp = /\.php$/,
  cwd?: Cwd,
  env?: Env,
) {
  boss_register(
    name,
    filter,
    (path) => [
      "php",
      "-r",
      `$data = ob_start(); $default = require "${path}"; if($default === 1) $default = ob_get_clean(); else ob_end_clean(); echo json_encode($default);`,
    ],
    cwd,
    env,
  );
}
