import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Load environment variables from .env file
config();

interface ServerConfig {
  port: number;
  mempoolBaseUrl: string;
  configSources: {
    port: "cli" | "env" | "default";
    mempoolBaseUrl: "cli" | "env" | "default";
  };
}

interface CliArgs {
  port?: number;
  "mempool-url"?: string;
}

export function getServerConfig(isStdioMode = false): ServerConfig {
  const argv = yargs(hideBin(process.argv))
    .options({
      port: {
        type: "number",
        description: "Port to run the server on",
      },
      "mempool-url": {
        type: "string",
        description: "Base URL for the Mempool API",
      },
    })
    .help()
    .version("0.1.0")
    .parseSync() as CliArgs;

  const config: ServerConfig = {
    port: 3333,
    mempoolBaseUrl: "https://mempool.space/api",
    configSources: {
      port: "default",
      mempoolBaseUrl: "default",
    },
  };

  if (argv.port) {
    config.port = argv.port;
    config.configSources.port = "cli";
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
    config.configSources.port = "env";
  }

  if (argv["mempool-url"]) {
    config.mempoolBaseUrl = argv["mempool-url"];
    config.configSources.mempoolBaseUrl = "cli";
  } else if (process.env.MEMPOOL_URL) {
    config.mempoolBaseUrl = process.env.MEMPOOL_URL;
    config.configSources.mempoolBaseUrl = "env";
  }

  if (!isStdioMode) {
    console.log("\nConfiguration:");
    console.log(
      `- PORT: ${config.port} (source: ${config.configSources.port})`
    );
    console.log(
      `- MEMPOOL_URL: ${config.mempoolBaseUrl} (source: ${config.configSources.mempoolBaseUrl})`
    );
    console.log();
  }

  return config;
}
