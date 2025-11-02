Web3 Languages, Episode 2: Solidity Without Tears (Or Reentrancy)

If you missed the series intro, start with **[Episode 1: The Big Four — Solidity, Vyper, Rust, and Move](https://medium.com/@DaveLumAI/web3-languages-episode-1-the-big-four-solidity-vyper-rust-and-move-no-buzzwords-just-49755111174a)** and the **[Web3 overview](https://medium.com/@DaveLumAI/web3-the-internets-makeover-you-can-actually-own-f162dd2d2f9f)** — then come back for today’s deep dive into Solidity, the EVM’s chatty extrovert who always shows up with a toolbelt and a stack of audit notes.


Solidity in One Breath  

Solidity is a contract-oriented, statically typed language designed for the Ethereum Virtual Machine. It compiles to EVM bytecode and powers apps on Ethereum and most L2s. The official docs live at **[docs.soliditylang.org](https://docs.soliditylang.org/)** and the language home is **[soliditylang.org](https://www.soliditylang.org/)**.


Is It Still Relevant?  

Very. As long as EVM chains remain the largest smart-contract neighborhood, Solidity remains prime real estate. New frameworks keep arriving, and security tooling keeps maturing. Translation: still a great skill to pick up — especially if you like shipping things that people can actually use.


What It’s Used For  

Everything from token standards ([ERC-20, ERC-721, ERC-1155](https://chatgpt.com/s/t_69068ddf2a6c819182890439190886cd)) to DeFi protocols, on-chain games, DAOs, identity registries, and weird social experiments where you can only post if you’ve staked your dignity.


Strengths  

• Ubiquity across Ethereum, Base, Optimism, Arbitrum, Polygon, BSC, and many app-chains  

• Deep ecosystem: templates, libraries, audits, examples, StackOverflow answers older than some NFTs  

• First-class tooling: try the in-browser IDE **[Remix](https://remix.ethereum.org/)**, full local stacks **[Hardhat](https://hardhat.org/)** and **[Foundry](https://getfoundry.sh/)**, and battle-tested libraries like **[OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)**


Weaknesses  

• [Foot-guns](https://chatgpt.com/s/t_69068eb24e2c8191adf5fc961385adf2): [reentrancy, access control, overflow/underflow](https://chatgpt.com/s/t_69068f42a54c81919aff74de253252f8) (less common post-0.8), and the eternal “I forgot to initialize the proxy admin”  

• Gas economics can turn beautiful code into a flaming wallet  

• Language evolves; older tutorials sometimes age like unrefrigerated sushi


Pros & Cons (Lightning Round)  

Pros: portable skills across EVM chains, huge community, tons of plugins, audits, and templates.  

Cons: security is unforgiving; one missing check can be a very expensive life lesson.


History (Lore You Can Drop in Meetings)  

Born in the early Ethereum days with C++/JS/Python vibes, Solidity was designed to target the EVM and evolve alongside it. Over time, safer defaults (checked arithmetic), custom errors, `receive`/`fallback`, immutables, and better tooling landed. The culture shifted from “move fast” to “move fast, fuzz faster.”


Who “Invented” It?  

Early Ethereum contributors led by people like Gavin Wood and the broader Solidity team shepherded its evolution; today it’s maintained by the Solidity team with active community input via EIPs and issues.


How Popular Is It — and Trend Lines  

Still the default for EVM. Alternatives nibble at edges, but job posts, hackathon winners, and protocol repos overwhelmingly lean Solidity. Popularity hasn’t cratered; it’s matured — less hype, more production.


Companies That Use It a Lot  

Exchanges, DeFi protocols, L2 teams, NFT platforms, wallets, infra providers — basically anyone deploying serious EVM logic. (If you’ve interacted with a major Ethereum protocol, you’ve interacted with Solidity.)


Similar To…  

If JavaScript and TypeScript eloped with C-style syntax and had a very serious child obsessed with money, state machines, and explicit visibility.


Does It Work Well with AI?  

Yes — as a co-pilot, not a parachute. Use LLMs for boilerplate and reviews, then hammer code with analyzers and fuzzers. Pair AI with hard security tools like **[Slither](https://github.com/crytic/slither)** (static analysis), **[Mythril](https://github.com/ConsenSysDiligence/mythril)** (symbolic execution), and fuzzers like Echidna/Foundry’s `forge fuzz`.


Tooling That Slaps  

• IDE: **[Remix](https://remix.ethereum.org/)** for quick prototypes  

• Local dev: **[Hardhat](https://hardhat.org/docs/getting-started)** and **[Foundry](https://github.com/foundry-rs/foundry)**  

• Libraries: **[OpenZeppelin Contracts](https://www.openzeppelin.com/solidity-contracts)** (and the Contracts Wizard)  

• Analysis: **[Slither](https://github.com/crytic/slither)**, **[Mythril](https://mythril-classic.readthedocs.io/en/master/about.html)**  

• Bonus security nerdery: coverage-guided fuzzing articles like **[Echidna guides](https://blog.trailofbits.com/2020/08/17/using-echidna-to-test-a-smart-contract-library/)**


What Tech Stack Plays Nicely  

Node.js + Hardhat (TypeScript), or Rust + Foundry. Add Ethers.js or viem for scripting and tests, a local JSON-RPC (Hardhat/Anvil), and your favorite wallet. CI runs lint → test → fuzz → static analysis → deploy.


How Much Will This Cost Me?  

The language is free. Tooling is free. You’ll pay for RPC, testnets (cheap/free), and mainnet gas. Efficient code and L2s are your friend.


Any Famous Art About It?  

Not yet. But many wallets have funded abstract expressionism — on Etherscan charts.


A Minimal, Sensible Example (with a tiny security brain)  

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TipJar with owner-only withdraw and event logs
contract TipJar {
    address public immutable owner;

    event Tipped(address indexed from, uint256 amount, string note);
    event Withdrawn(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function tip(string calldata note) external payable {
        require(msg.value > 0, "Send ETH");
        emit Tipped(msg.sender, msg.value, note);
    }

    function withdraw(address payable to) external {
        require(msg.sender == owner, "Only owner");
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        to.transfer(bal);
        emit Withdrawn(to, bal);
    }
}
````

Deploy it in minutes: prototype in **[Remix](https://remix.ethereum.org/)**, or scaffold tests and scripts with **[Hardhat](https://hardhat.org/)** or **[Foundry](https://getfoundry.sh/)**, and swap your stringly-typed access control for a real role system using **[OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)**.

Alternatives (And When to Reach for Them)

• Vyper: Pythonic, minimalist, “fewer foot-guns,” often chosen for security-critical code.

• Rust (Ink!/Solang/etc.): ecosystems beyond EVM or for low-level control.

• Move: resource-centric, strong safety guarantees; common in non-EVM ecosystems.

Pick the one that matches your target chain and team skills.

Does Solidity Play Nicely with AI?

Yes — use AI for scaffolding, refactors, and invariants; let fuzzers and static analysis be the bouncers. Human code reviews stay non-negotiable.

Interesting Tidbits

• Most exploits are boring in hindsight: missing `onlyOwner`, unchecked calls, sloppy math, or trust assumptions.

• Gas savings often come from “unsexy” choices: custom errors, immutables, packing, avoiding unbounded loops.

• You can learn a ton by reading real code: token standards and upgradeable patterns in **[OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)**.

Try a Real Product

Spin up a quick prototype straight in the browser with **[Remix](https://remix.ethereum.org/)** — compile, deploy to a testnet, and share a link with your team. No installs. Maximum momentum.

Your Turn

Have questions, weird bug stories, or a spicy “why Solidity, actually?” take? Drop a comment and follow for the next episodes (Vyper, Rust, Move). Let’s build something that doesn’t reenter your dreams at 3 a.m.

[Art Prompt (Cubism):](https://lumaiere.com/?gallery=cubism3)

A fractured portrait built from sharp, interlocking planes that slice the figure and background into faceted geometry; warm rose and ochre fields collide with cool slate-blue shadows; mask-like eyes stare from multiple angles at once, noses skewed into elegant diagonals; limbs reduced to cylinders and wedges; composition tightly packed, edges slightly rough; brushwork dry and deliberate, forms flattened yet volumetric; atmosphere charged, intimate, and a touch unsettling, as if space itself were rearranging to accommodate the subject.

[Video Prompt:](https://www.tiktok.com/@davelumai/video/7567728306552835358)

Snap into action with a quick slam-cut from a blank canvas to a burst of angular shapes assembling themselves; staccato jump cuts reveal cheeks, eyes, and hands as faceted planes; rotate the “camera” around the portrait so planes catch and lose light; interleave a rapid kaleidoscope flip where geometry mirrors for one beat, then shatters back into the main composition; finish by pulling the planes apart like sliding tiles before they click back together on the final beat.

Two songs that pair beautifully with the motion above:
- Ljósið – Ólafur Arnalds
- Back Pocket – Vulfpeck

If this helped, follow for the rest of the series and tell me in the comments what you want benchmarked, audited, or roasted next.
