import { unlinkSync } from "node:fs";
import { type Cwd, type Env, type Result, load, register, run } from "boss.sh";
import type { Server } from "bun";

export type Data = Record<string, any>;

export async function execute(
  path: string,
  cwd?: Cwd,
  env?: Env,
): Promise<Result> {
  return await run(path, ["php", "-f", path], cwd, env);
}

export async function serve(
  path: string,
  request: Request,
  server: Server,
  data?: Data,
  cwd?: Cwd,
  env?: Env,
): Promise<Response> {
  env = env ?? {};
  const url = new URL(request.url);
  const remote = server.requestIP(request);
  const pathname = decodeURIComponent(url.pathname);

  env.SERVER_ADDR = server.hostname;
  env.SERVER_NAME =
    server.hostname in ["localhost", "127.0.0.1", "::1", "0.0.0.0"]
      ? "localhost"
      : server.hostname;
  env.SERVER_SOFTWARE = "Phun";
  env.SERVER_PORT = server.port.toString();
  env.GATEWAY_INTERFACE = "CGI/1.1";
  env.SERVER_PROTOCOL = "HTTP/1.1";
  env.REQUEST_URI = pathname;
  env.REQUEST_METHOD = request.method || "GET";
  env.REQUEST_TIME = Math.floor(Date.now() / 1000).toString();
  env.REQUEST_TIME_FLOAT = (Date.now() / 1000).toString();
  env.REMOTE_ADDR = remote?.address;
  env.REMOTE_PORT = remote?.port.toString();
  env.REMOTE_FAMILY = remote?.family;
  env.DOCUMENT_ROOT = cwd || process.cwd();
  env.SCRIPT_FILENAME = path;
  env.SCRIPT_NAME = pathname;
  env.PHP_SELF = pathname;
  env.QUERY_STRING = url.searchParams.toString();
  env.HTTPS = server.url.protocol === "https" ? "on" : "";

  for (let [key, value] of request.headers) {
    if (!key.toLowerCase().startsWith("content-")) {
      key = `HTTP_${key}`;
    }
    env[key.replace(/-/g, "_").toUpperCase()] = value;
  }

  const result = await use(path, data, cwd, env);

  return new Response(result.default, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

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
  return render.default;
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
      `$data = json_decode('${json}', true); if(is_array($data) && !\\array_is_list($data)) extract($data); ob_start(); $default = require "${path}"; if($default === 1) $default = ob_get_clean(); else ob_end_clean(); echo json_encode(headers_sent() ? ['headers' => headers_list(), 'data' => $default] : $default);`,
    ],
    cwd,
    env,
  );
}

export function setup(
  name = "PHP Loader",
  filter: RegExp = /\.php$/,
  cwd?: Cwd,
  env?: Env,
) {
  register(
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
