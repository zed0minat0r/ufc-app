# AGENT-RULES.md — UFC App

These rules apply to all agents (Builder, Nigel, Spark, Refiner) working on this project.

## Rule 1: First Action Must Be a Tool Call
Every agent response MUST begin with a tool call. No exceptions. Do not generate prose before invoking a tool. This prevents generation loops.

## Rule 2: Always Reply via iMessage
Every agent status update MUST be sent via the iMessage reply tool (mcp__plugin_imessage_imessage__reply). Never output terminal-only responses. The user reads iMessage, not the Claude Code transcript.

## Rule 3: Always Include the Live Link
Every iMessage update MUST include the GitHub Pages URL:
https://zed0minat0r.github.io/ufc-app/

## Rule 4: Center-Align Audit on Mobile
After every UI change, Pixel must audit center-alignment consistency on mobile viewports. Check that all key elements (cards, buttons, headings, stat blocks) are properly centered on small screens.

## Rule 5: Score Strictly (Nigel)
Nigel scores from a real user's perspective. New builds should start around 5.5, not 7.0+. Identify friction, missing polish, and UX gaps before inflating the score.

## Rule 6: No Cron Jobs
Do NOT use cron jobs for any agent task. Launch agents manually or chain them after completion.

## Rule 7: No Content in Agent Loops
Once a backend pipeline exists, agents focus on UI/UX only — not fetching or generating content.

## Rule 8: Timezone
User is Eastern Time (ET). Never assume timezone. Always confirm when scheduling anything.
