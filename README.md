<div align="center"><sub>
English | <a href="https://github.com/cline/cline/blob/main/locales/es/README.md" target="_blank">Español</a> | <a href="https://github.com/cline/cline/blob/main/locales/de/README.md" target="_blank">Deutsch</a> | <a href="https://github.com/cline/cline/blob/main/locales/ja/README.md" target="_blank">日本語</a> | <a href="https://github.com/cline/cline/blob/main/locales/zh-cn/README.md" target="_blank">简体中文</a> | <a href="https://github.com/cline/cline/blob/main/locales/zh-tw/README.md" target="_blank">繁體中文</a> | <a href="https://github.com/cline/cline/blob/main/locales/ko/README.md" target="_blank">한국어</a>
</sub></div>

# CHOAM

<p align="center">
  <img src="https://media.githubusercontent.com/media/cline/cline/main/assets/docs/demo.gif" width="100%" />
</p>

<div align="center">
<table>
<tbody>
<td align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev" target="_blank"><strong>Download on VS Marketplace</strong></a>
</td>
<td align="center">
<a href="https://discord.gg/cline" target="_blank"><strong>Discord</strong></a>
</td>
<td align="center">
<a href="https://www.reddit.com/r/cline/" target="_blank"><strong>r/cline</strong></a>
</td>
<td align="center">
<a href="https://github.com/cline/cline/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop" target="_blank"><strong>Feature Requests</strong></a>
</td>
<td align="center">
<a href="https://docs.cline.bot/getting-started/for-new-coders" target="_blank"><strong>Getting Started</strong></a>
</td>
</tbody>
</table>
</div>

CHATBOT HUB ORGANIZATION AND MANAGEMENT <br>
CHOAM is the tool we always wanted.  <br>
CHOAM has arrived. <br>
CHOAM is an AI assistant that can use your command line and editor.<br>

CHOAM is a fork of Cline that has been upgraded to allow you to select multiple chatbots to work together with you on your projects.<br>

I wanted 2 or more AI bots to chat and work together when I code in the same VSCode window where I chat with Cline, and, figuring 2 heads are better than one I set out to make a 2 headed Cline: CHOAM.<br>
Knowing that Slack allows for multiple chatbots to participate in a group chat I realized I wanted that in VSCode.<br>
Early on I'd have 2 browser tabs open with 2 different brands of AI and I'd tell them to work a few adversarial rounds to debate the best path into view and then work a few collaborative rounds to optimize the plan for that path. <br>
That boosted productivity as I realized I was doing the same pattern of copy & pasting from tab to tab over and over.. <br>
The results were great though. <br>
Then I found Cline, WHAT A BLESSING ! <br>
A stick has 1000 uses, but rub 2 sticks together and you get fire.<br>
One AI chatbot has a zillion uses, but rub 2 AI chatbots together.. <br> 
and soon your bot will stare at you out of it's left eye like a cow when it's processing unfamilliar images (ha ha).  <br> 
Ok, that's my 2 sats worth, now on to the dry details:

Thanks to [Claude Sonnet's agentic coding capabilities](https://www.anthropic.com/claude/sonnet), CHOAM can handle complex software development tasks step-by-step. With tools that let her create & edit files, explore large projects, use the browser, and execute terminal commands (after you grant permission), she can assist you in ways that go beyond code completion or tech support. CHOAM can even use the Model Context Protocol (MCP) to create new tools and extend her own capabilities. While autonomous AI scripts traditionally run in sandboxed environments, this extension provides a human-in-the-loop GUI to approve every file change and terminal command, providing a safe and accessible way to explore the potential of multi agentic AI.

1. Enter your task and add images to convert mockups into functional apps or fix bugs with screenshots.
2. CHOAM starts by analyzing your file structure & source code ASTs, running regex searches, and reading relevant files to get up to speed in existing projects. By carefully managing what information is added to context, CHOAM can provide valuable assistance even for large, complex projects without overwhelming the context window.
3. Once CHOAM has the information she needs, she can:
    - Create and edit files + monitor linter/compiler errors along the way, letting her proactively fix issues like missing imports and syntax errors on her own.
    - Execute commands directly in your terminal and monitor their output as she works, letting her e.g., react to dev server issues after editing a file.
    - For web development tasks, CHOAM can launch the site in a headless browser, click, type, scroll, and capture screenshots + console logs, allowing her to fix runtime errors and visual bugs.
4. When a task is completed, CHOAM will present the result to you with a terminal command like `open -a "Google Chrome" index.html`, which you run with a click of a button.

> [!TIP]
> Follow [this guide](https://docs.cline.bot/features/customization/opening-cline-in-sidebar) to open CHOAM on the right side of your editor. This lets you use CHOAM side-by-side with your file explorer, and see how she changes your workspace more clearly.

---

<img align="right" width="340" src="https://github.com/user-attachments/assets/3cf21e04-7ce9-4d22-a7b9-ba2c595e88a4">

### Use any API and Model

CHOAM supports API providers like OpenRouter, Anthropic, OpenAI, Google Gemini, AWS Bedrock, Azure, GCP Vertex, Cerebras and Groq. You can also configure any OpenAI compatible API, or use a local model through LM Studio/Ollama. If you're using OpenRouter, the extension fetches their latest model list, allowing you to use the newest models as soon as they're available.

The extension also keeps track of total tokens and API usage cost for the entire task loop and individual requests, keeping you informed of spend every step of the way.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="left" width="370" src="https://github.com/user-attachments/assets/81be79a8-1fdb-4028-9129-5fe055e01e76">

### Run Commands in Terminal

Thanks to the new [shell integration updates in VSCode v1.93](https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api), CHOAM can execute commands directly in your terminal and receive the output. This allows her to perform a wide range of tasks, from installing packages and running build scripts to deploying applications, managing databases, and executing tests, all while adapting to your dev environment & toolchain to get the job done right.

For long running processes like dev servers, use the "Proceed While Running" button to let CHOAM continue in the task while the command runs in the background. As CHOAM works he’ll be notified of any new terminal output along the way, letting her react to issues that may come up, such as compile-time errors when editing files.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="right" width="400" src="https://github.com/user-attachments/assets/c5977833-d9b8-491e-90f9-05f9cd38c588">

### Create and Edit Files

CHOAM can create and edit files directly in your editor, presenting you a diff view of the changes. You can edit or revert CHOAM's changes directly in the diff view editor, or provide feedback in chat until you're satisfied with the result. CHOAM also monitors linter/compiler errors (missing imports, syntax errors, etc.) so she can fix issues that come up along the way on her own.

All changes made by CHOAM are recorded in your file's Timeline, providing an easy way to track and revert modifications if needed.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="left" width="370" src="https://github.com/user-attachments/assets/bc2e85ba-dfeb-4fe6-9942-7cfc4703cbe5">

### Use the Browser

With Claude Sonnet's new [Computer Use](https://www.anthropic.com/news/3-5-models-and-computer-use) capability, CHOAM can launch a browser, click elements, type text, and scroll, capturing screenshots and console logs at each step. This allows for interactive debugging, end-to-end testing, and even general web use! This gives her autonomy to fixing visual bugs and runtime issues without you needing to handhold and copy-pasting error logs yourself.

Try asking CHOAM to "test the app", and watch as she runs a command like `npm run dev`, launches your locally running dev server in a browser, and performs a series of tests to confirm that everything works. [See a demo here.](https://x.com/sdrzn/status/1850880547825823989)

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="right" width="350" src="https://github.com/user-attachments/assets/ac0efa14-5c1f-4c26-a42d-9d7c56f5fadd">

### "add a tool that..."

Thanks to the [Model Context Protocol](https://github.com/modelcontextprotocol), CHOAM can extend her capabilities through custom tools. While you can use [community-made servers](https://github.com/modelcontextprotocol/servers), CHOAM can instead create and install tools tailored to your specific workflow. Just ask CHOAM to "add a tool" and she will handle everything, from creating a new MCP server to installing it into the extension. These custom tools then become part of Cline's toolkit, ready to use in future tasks.

-   "add a tool that fetches Jira tickets": Retrieve ticket ACs and put CHOAM to work
-   "add a tool that manages AWS EC2s": Check server metrics and scale instances up or down
-   "add a tool that pulls the latest PagerDuty incidents": Fetch details and ask CHOAM to fix bugs

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="left" width="360" src="https://github.com/user-attachments/assets/7fdf41e6-281a-4b4b-ac19-020b838b6970">

### Add Context

**`@url`:** Paste in a URL for the extension to fetch and convert to markdown, useful when you want to give CHOAM the latest docs

**`@problems`:** Add workspace errors and warnings ('Problems' panel) for CHOAM to fix

**`@file`:** Adds a file's contents so you don't have to waste API requests approving read file (+ type to search files)

**`@folder`:** Adds folder's files all at once to speed up your workflow even more

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="right" width="350" src="https://github.com/user-attachments/assets/140c8606-d3bf-41b9-9a1f-4dbf0d4c90cb">

### Checkpoints: Compare and Restore

As CHOAM works through a task, the extension takes a snapshot of your workspace at each step. You can use the 'Compare' button to see a diff between the snapshot and your current workspace, and the 'Restore' button to roll back to that point.

For example, when working with a local web server, you can use 'Restore Workspace Only' to quickly test different versions of your app, then use 'Restore Task and Workspace' when you find the version you want to continue building from. This lets you safely explore different approaches without losing progress.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

## Contributing

To contribute to the project, start with our [Contributing Guide](CONTRIBUTING.md) to learn the basics. You can also join our [Discord](https://discord.gg/cline) to chat with other contributors in the `#contributors` channel. If you're looking for full-time work, check out our open positions on our [careers page](https://cline.bot/join-us)!

## DEDICATION 

```
*************************************************************************************************************************************************************

 ██████╗██╗  ██╗ ██████╗  █████╗ ███╗   ███╗
██╔════╝██║  ██║██╔═══██╗██╔══██╗████╗ ████║
██║     ███████║██║   ██║███████║██╔████╔██║
██║     ██╔══██║██║   ██║██╔══██║██║╚██╔╝██║
╚██████╗██║  ██║╚██████╔╝██║  ██║██║ ╚═╝ ██║
 ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝  

by  

 ██████╗  ██████╗ ██╗     ██████╗  ██████╗ ██╗   ██╗ █████╗ ██╗     
██╔════╝ ██╔═══██╗██║     ██╔══██╗██╔═══██╗██║   ██║██╔══██╗██║     
██║  ███╗██║   ██║██║     ██║  ██║██║   ██║██║   ██║███████║██║     
██║   ██║██║   ██║██║     ██║  ██║██║   ██║╚██╗ ██╔╝██╔══██║██║     
╚██████╔╝╚██████╔╝███████╗██████╔╝╚██████╔╝ ╚████╔╝ ██║  ██║███████╗
 ╚═════╝  ╚═════╝ ╚══════╝╚═════╝  ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝  

THANK YOU to all the good people that made this project possible, it could not have happened without your support!

 THANK YOU CLINE DEV TEAM for making CLINE.  

Hello & blessings to Henderson Roots! Hi Mom! Thanks for all the trips the Exploratorium, the Commodore 64,
the skateboards, the real food, the rides to Radio Shack and the Coin Shop. Love at the Speed of Light!
   By GOLDOVAL, this Token was built on a strict diet of eggs.
Eggs & instant coffee to offset the AI subscriptions & the finest Appellation of Origin grown in the ground under the sun better than Organic small batch hand crafted Big Sur Holy Weed.
California is The Golden State.      

As all continues to go according to plan, like swiss clockwerk, like Lizzo, I will have a larger social media presence 2026 and onwards if work my axe oft. 
Been reaching out to people to help orange pill Laurence Tureaud, a.k.a. Mr. T so when that happens maybe he'll repost a tweet for me, Captain Extra Cheugy.
That said, at the beginning of the day, what is important is that while I'm launching my media empire I'll be like The A-Team: In 2021, a crack commando comedy unit was sent to deplatformed by a militaristic community 
standards court for a crime they didn’t commit. This man promptly escaped from a maximum security YOUR ACCOUNT HAS BEEN SUSPENDED stockade to the Los Angeles underground. Today, still wanted by the World 
Government (ahemstrawhat ahem), she survive as sheet of posterboard of itinerant fortune. If you have a problem, If no one else can help and if you can find him. Maybe you can hire, GOLDOVAL.
WE ARE 8.2 BILLION cousins. SEE HUMAN FIRST. BE HUMAN FIRST.
Made with love as a gift for EVERYONE, this CHOAM estension is designed to provide you an order of magnitude greater productivity, and, part of the dream is that you share the dream so I hope in some way this tools 
allows it's users to spend more time with family and friends wihile getting more beter quality work done at work in less time. More Better. More Awesomer.
It's the first week of December 2025 and the world is still here getting better every day !  
Play awesome games with awesome people win awesome prizes ! 
Here's yours !
block 926625 =    000000000000000000011b2b773e73fda41e90dd954844365e595fcdb3b1a825  

*************************************************************************************************************************************************************
```

## Enterprise

Get the same CHOAM experience with enterprise-grade controls: SSO (SAML/OIDC), global policies and configuration, observability with audit trails, private networking (VPC/private link), and self-hosted or on-prem deployments, and enterprise support. Learn more at our [enterprise page](https://cline.bot/enterprise) or [talk to us](https://cline.bot/contact-sales).


## License

[Apache 2.0 © 2025 CHOAM Bot Inc.](./LICENSE)
