import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import yaml from "js-yaml";
import fetch from "node-fetch";
import { z } from "zod";
import { Logger } from "./logger.js";

export class CustomMcpServer extends McpServer {
  constructor(baseUrl: string = "https://mempool.space/api") {
    super(
      { name: "Bitcoin Mempool MCP Server", version: "0.1.0" },
      { capabilities: { logging: {}, tools: {} } }
    );

    this.registerTools(baseUrl);
  }

  private registerTools(baseUrl: string): void {
    const GetMiningPoolsSchema = z.object({
      timePeriod: z
        .string()
        .optional()
        .default("1w")
        .describe(
          "Optional: trailing period like 24h, 3d, 1w, 1m, 3m, 6m, 1y, 2y, 3y"
        ),
    });

    const GetMiningPoolSchema = z.object({
      slug: z.string().describe("Mining pool slug (e.g., slushpool)"),
    });

    const GetMiningPoolHashratesSchema = z.object({
      timePeriod: z
        .string()
        .optional()
        .default("1m")
        .describe("Optional: 1m, 3m, 6m, 1y, 2y, 3y"),
    });

    const GetMiningPoolHashrateSchema = z.object({
      slug: z.string().describe("Mining pool slug (e.g., foundryusa)"),
    });

    const GetMiningPoolBlocksSchema = z.object({
      slug: z.string().describe("Mining pool slug (e.g., luxor)"),
      blockHeight: z
        .union([z.string(), z.number()])
        .optional()
        .describe("Optional block height to look back from (e.g., 730000)"),
    });

    const GetHashrateSchema = z.object({
      timePeriod: z
        .string()
        .optional()
        .default("1m")
        .describe("Optional: 1m, 3m, 6m, 1y, 2y, 3y"),
    });

    this.tool(
      "get_mining_pools",
      "Returns a list of all known mining pools ordered by blocks found over the specified trailing timePeriod.",
      GetMiningPoolsSchema.shape,
      async ({ timePeriod = "1w" }) => {
        const url = `${baseUrl}/v1/mining/pools/${timePeriod}`;
        return await this.fetchAndFormat(url);
      }
    );

    this.tool(
      "get_mining_pool",
      "Returns details about the mining pool specified by slug.",
      GetMiningPoolSchema.shape,
      async ({ slug }) => {
        return await this.fetchAndFormat(`${baseUrl}/v1/mining/pool/${slug}`);
      }
    );

    this.tool(
      "get_mining_pool_hashrates",
      "Returns average hashrates and share of total hashrate for active mining pools over the specified trailing timePeriod.",
      GetMiningPoolHashratesSchema.shape,
      async ({ timePeriod = "1m" }) => {
        return await this.fetchAndFormat(
          `${baseUrl}/v1/mining/hashrate/pools/${timePeriod}`
        );
      }
    );

    this.tool(
      "get_mining_pool_hashrate",
      "Returns all known hashrate data for the mining pool specified by slug. Hashrate values are weekly averages.",
      GetMiningPoolHashrateSchema.shape,
      async ({ slug }) => {
        return await this.fetchAndFormat(
          `${baseUrl}/v1/mining/pool/${slug}/hashrate`
        );
      }
    );

    this.tool(
      "get_mining_pool_blocks",
      "Returns past 10 blocks mined by the specified mining pool before the specified blockHeight. If not specified, returns the 10 most recent blocks.",
      GetMiningPoolBlocksSchema.shape,
      async ({ slug, blockHeight }) => {
        const url = blockHeight
          ? `${baseUrl}/v1/mining/pool/${slug}/blocks/${blockHeight}`
          : `${baseUrl}/v1/mining/pool/${slug}/blocks`;
        return await this.fetchAndFormat(url);
      }
    );

    this.tool(
      "get_hashrate",
      "Returns current and historical network-wide hashrate and difficulty figures over the specified trailing timePeriod.",
      GetHashrateSchema.shape,
      async ({ timePeriod = "1m" }) => {
        return await this.fetchAndFormat(
          `${baseUrl}/v1/mining/hashrate/${timePeriod}`
        );
      }
    );
  }

  private async fetchAndFormat(url: string) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return {
        content: [{ type: "text" as const, text: yaml.dump(data) }],
      };
    } catch (err) {
      Logger.error(`Error fetching ${url}:`, err);
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: `Error fetching data: ${
              err instanceof Error ? err.message : String(err)
            }`,
          },
        ],
      };
    }
  }

  async connect(transport: Transport): Promise<void> {
    await super.connect(transport);

    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk: any, encoding?: any, callback?: any) => {
      if (typeof chunk === "string" && !chunk.trim().startsWith("{")) {
        return true; // suppress non-JSON stdout
      }
      return originalStdoutWrite(chunk, encoding, callback);
    };

    Logger.log("Solana QuickNode MCP server is running.");
  }
}
