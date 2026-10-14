# 免费在线 AI 接入与当前修复状态

## 已确认的问题

此前游戏使用 `text.pollinations.ai/<整段提示词>` 的免授权旧请求。实测出现过 404；本次复查短请求返回 402，POST 请求超时。正式 `gen.pollinations.ai/v1/chat/completions` 无授权时返回 401，并明确要求有效 API key。

官方说明：https://github.com/pollinations/pollinations#-authentication

这不是只在微信发生的语音权限问题。旧地址和匿名调用方式不能被当作稳定在线 AI。

## 本次已经接好的路径

- 使用正式 POST JSON 调用，不把长提示词放进 URL。
- 读取 OpenAI-compatible `choices[0].message.content`，也接受后端 `{text}`。
- 401（授权）、402（额度）、403（模型权限）、404（地址／模型）、429（限流）、网络问题分别报告。
- 502／503／504 可重试一次；授权／额度／404 不反复重试。
- 25 秒超时后使用离线回答，仍明确显示来源。
- 未配置授权时不请求旧接口，也不假称在线已成功。

**已部署并实测成功：Groq Free Plan → 服务端 secret → 公共 HTTPS 后端 → 游戏。公开 POST 返回 200，完整中文答辩约 3 秒；微信实机仍需用户侧确认网络可达性。**


## 推荐免费方案：Groq Free Plan

创建 key：https://console.groq.com/keys

官方免费限额：https://console.groq.com/docs/rate-limits

保持 Free Plan，不升级 Developer。当前官方表格给 GPT-OSS 120B／20B 等列出 30 次／分钟、1000 次／天，并有 8000 Token／分钟及 200000 Token／天限制；以账户实际额度为准。超限会返回 429。不是不限量免费，也不能保证每个网络都可访问。

已经准备 `server/groq-worker.mjs`，以服务端 secret 调用 Groq。默认 GPT-OSS 120B，只允许当前免费额度表中的三个文本模型，不自动换付费提供商。账户是否免费仍由 Groq 的账户计划决定；不要升级计划。

### 配置步骤

1. 创建 Groq key，保存到服务端的 `GROQ_API_KEY` secret，不要放进网页或公开仓库。
2. 使用 Cloudflare Workers 的 Free 账户部署 `server/groq-worker.mjs`。部署配置在 `server/wrangler.toml`，项目内不包含实际 secret。
3. 通过 Cloudflare 控制台设置 secret，或在本机执行 `wrangler secret put GROQ_API_KEY`，再部署。CLI 需由账户持有人先登录。
4. 得到 HTTPS Worker 地址后，在游戏“可选设置 → 连接在线 AI”填写地址；或由作者配置 `ai-config.js` 的 endpoint 供全部玩家使用。
5. 测试连接后再用完整项目验证生成。Groq key 不填进前端的公开 key 栏。

Worker 仅允许游戏来源的 POST／OPTIONS，每 IP 每分钟 6 次的实例内保护，不把提供商错误正文或 key 回传。该限流不是跨节点全局额度保证；Groq 免费账户额度仍是实际边界。服务已通过 Sites 的 Cloudflare Worker 部署，实际 key 仅保存在服务端 secret。公共地址：`https://academic-mouthpiece-ai.ginagina1999.chatgpt.site/api/defence`。`ai-config.js` 已设置地址，所有玩家无需填写 key。

下面是兼容既有服务的说明，不是本项目推荐的免费方案。

## 兼容方案 A：已有 Pollinations 公开应用授权

1. 在官方账户创建供浏览器使用的公开应用 key，前缀是 `pk_`。
2. 限制其模型权限和预算；调用可能消耗账户额度。
3. 在游戏右下角“可选设置”展开“连接在线 AI”，填入应用 key，点击“测试连接”。
4. 在线模型默认为 `openai` 别名，也可填账户有权访问的正式模型 ID。
5. 在“选择策略后生成玩家话术”选择 AI；若想生成教授点评，再把教授反馈改为在线 AI。

这个输入不会保存到浏览器存档，刷新后需重新填。只有测试真正返回有效文字，才显示连接成功；它不等于每个复杂答辩都必然成功。

若作者希望所有玩家共用授权，可在 `ai-config.js` 配置专为公开客户端设计的 `pk_`，但必须先由账户持有人设置预算与模型权限。不要把 `sk_` 或其他私密 key 写进静态文件、GitHub 仓库或前端。

## 兼容方案 B：已有 HTTPS AI 后端

在“连接在线 AI”填入服务地址。前端将发送：

```json
{"prompt":"完整游戏提示词","model":"openai"}
```

后端应返回以下任一种：

```json
{"text":"生成的中文回答"}
```

```json
{"choices":[{"message":{"content":"生成的中文回答"}}]}
```

后端需要支持来自 `https://ginagina19992023.github.io` 的 POST／OPTIONS 跨域访问，允许 `Content-Type` 请求头。模型私密 key 留在后端；额度、访问与请求频率由后端管理。前端不会把应用 key 转发到这个自定义地址。

作者可在 `ai-config.js` 配置公共后端地址供所有玩家使用；该文件只包含公开配置。没有有效后端地址时，本项目仍由 GitHub Pages 提供静态游戏，不会凭空获得服务端能力。

## 如何验收

先通过连接测试，再用完整项目和真实教授问题生成答辩，确认状态明确显示“AI 现编”，而不是“离线回答”。随后在微信、Safari、Chrome 分别完成三轮，记录响应速度与错误。

当前测试覆盖了请求协议、错误分流、未配置时不发请求、取消旧生成、防跑题检查和离线回退。模拟 API 测试不能代替有真实授权的在线验证。
