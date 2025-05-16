# Bitcoin Mempool MCP Server ⚡️

## Collaboration between [AICMP <img src="https://github.com/stvagi/mempool-mcp/raw/main/src/aicmp.jpg" width="20" style="border-radius:50%"/>](https://x.com/AICMPBTC) and [MOOF <img src="https://github.com/stvagi/mempool-mcp/raw/main/src/moof.png" width="20" style="border-radius:50%"/>](https://x.com/moofdotfun)

![GitHub Repo stars](https://img.shields.io/github/stars/your-org/mempool-mcp?style=social)
![npm](https://img.shields.io/npm/dt/mempool-mcp)

> 🔌 **Compatible with [Claude Desktop](https://claude.ai/desktop), [VS Code](https://code.visualstudio.com/), [Cursor](https://cursor.sh), [Cline](https://github.com/cline/cline), and other MCP clients.**
>
> This MCP server provides AI assistants with real-time access to the [Mempool.space](https://mempool.space) API for mining data, pool stats, and hashrate analytics.
>

---

## Overview

The **Model Context Protocol (MCP)** allows AI agents to invoke external tools and APIs. This server acts as a live bridge to [mempool.space](https://mempool.space), exposing Bitcoin mining insights and hashrate metrics.

### Features

- 🔍 Query mining pool rankings and blocks
- 📊 Fetch historical and real-time hashrate stats
- 🧠 Designed for use in Claude, Cursor, VS Code, and more
- ⚙️ Tools exposed via MCP standard: `get_mining_pools`, `get_mining_pool_blocks`, `get_hashrate`, etc.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- Internet access to `https://mempool.space`
- MCP-compatible client (Claude Desktop, Cursor, VS Code, etc.)

---

## Installation & Usage

### Run with NPX

```bash
npx -y mempool-mcp@0.1.0
```
