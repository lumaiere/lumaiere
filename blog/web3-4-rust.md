# Web3 Languages: Episode 4 — Rust, The Borrow Checker With Biceps

If the first three episodes gave you the lay of the land, this one is the trail run with ankle weights and a snack break. Rust is what happens when a systems language hits the gym, reads a few chapters on type theory, and decides memory safety can be fast, actually. If you need a refresher on the bigger Web3 picture, the **[Web3 overview](https://medium.com/@DaveLumAI/web3-the-internets-makeover-you-can-actually-own-f162dd2d2f9f)** is a good place to start. Then come back, lace up, and let’s ship something fearless.

**What is it?**

Rust is a general-purpose, compiled language focused on performance and memory safety without garbage collection. Its superpower is the ownership and borrowing model: a strict-but-kind chaperone that stops data races and most memory shenanigans at compile time. Start here if you want the canonical docs and install path: **[rust-lang.org](https://www.rust-lang.org/)** (and its one-liner installer via **[rustup](https://rust-lang.org/tools/install/)**). 

**Is it still relevant?**

Oh yes. Rust remains a perennial fan favorite in developer surveys and keeps climbing into serious production stacks. It’s consistently at or near the top of “most admired” language rankings; see the latest numbers in the **[Stack Overflow survey](https://survey.stackoverflow.co/2024/technology)**. 

**What is it used for (in Web3, specifically)?**

* **High-performance chains & contracts:** Solana programs (smart contracts) are written in Rust (natively or with frameworks). The official **[Solana Rust guide](https://solana.com/docs/programs/rust)** covers the model. On Polkadot, the **[Polkadot SDK](https://polkadot.com/platform/sdk/)** (formerly Substrate) is Rust-based for rolling your own chain. NEAR supports first-class **[Rust smart contracts](https://docs.near.org/)**. The Cosmos ecosystem’s **[CosmWasm](https://book.cosmwasm.com/)** framework compiles Rust to Wasm for contracts across many chains. 

* **Frameworks that smooth the edges:** For Solana, **[Anchor](https://www.anchor-lang.com/)** (and its **[GitHub](https://github.com/solana-foundation/anchor)**) provides macros, IDLs, and testing conveniences. On Polkadot, **[ink!](https://use.ink/)** offers a Rust DSL for contracts. CosmWasm provides crates like **[cosmwasm-std](https://docs.rs/cosmwasm-std)** and battle-tested tooling. 

**Pros (a selective bouquet):**

* **Memory safety with zero GC:** You get C/C++-class speed with compile-time checks instead of runtime collection. 

* **Fearless concurrency:** The type system bans data races like the bouncer who actually checks IDs. 

* **Best-in-class tooling:** `cargo` and `rustup` are grown-up and a joy. See **[The Cargo Book](https://doc.rust-lang.org/cargo/)**. 

* **Ecosystem reach:** From Solana to Polkadot to NEAR to Cosmos via CosmWasm—one language, many L1s/L2s. 

**Cons (honest hour):**

* **Learning curve:** Ownership feels weird at first. It clicks—eventually—and then you’ll be That Person at meetups.

* **Compile times:** Improving, but big projects can make your laptop fan audition for a jet engine.

* **Ecosystem fragmentation (Web3 side):** Multiple chains = multiple frameworks, differing ABIs, testing stacks, and deployment workflows.

**Strengths & weaknesses (Web3 edition):**

* **Strengths:** Throughput and safety. Rust’s strictness catches many smart-contract bugs before chain time. It also maps well to Wasm (CosmWasm/ink!) and BPF (Solana). 

* **Weaknesses:** Portability of a single codebase across ecosystems isn’t automatic; each platform has its own SDK idioms and testing approach.

**Alternatives you’ll run into:**

* **Solidity/Vyper** (EVM world; see the earlier episodes).

* **Move** (Aptos/Sui); a safe, resource-oriented language with a different model.

* **Ink!/CosmWasm** are not “alternatives” to Rust so much as Rust-powered approaches in different ecosystems. 

**Does it work well with AI?**

Surprisingly well. Rust has native ML stacks like **[Burn](https://burn.dev/)** and bindings to PyTorch via **[tch-rs](https://github.com/LaurentMazare/tch-rs)**, so you can serve models without babysitting a GC. This is handy for latency-sensitive on-chain/off-chain services. 

**Real-world receipts (companies & infra):**

* **AWS**: **[Firecracker microVMs](https://github.com/firecracker-microvm/firecracker)** are written in Rust.

* **Discord**: Rewrote a core service in Rust for perf gains—see **[their post](https://discord.com/blog/why-discord-is-switching-from-go-to-rust)**.

* **Cloudflare**: Rust underpins modern proxies/frameworks like **[Oxy](https://blog.cloudflare.com/introducing-oxy/)** and production foundations. 

**How popular is it, and is it rising or falling?**

Still rising in production usage and mindshare. Surveys keep Rust at the top for developer affection, while infra teams keep shipping mission-critical pieces with it. **[Stack Overflow’s 2024 survey](https://survey.stackoverflow.co/2024/technology)** reflects the “keep using it” sentiment. 

**History & “who invented it?”**

Rust started as a side project by Graydon Hoare in the late 2000s, incubated at Mozilla, and hit 1.0 in 2015. It’s now stewarded by the **[Rust Foundation](https://rustfoundation.org/)**. 

**Tech stack & tools you’ll touch:**

* **rustup** for toolchains; **cargo** for building/testing/publishing. (**[Install](https://rust-lang.org/tools/install/)**, **[Cargo](https://doc.rust-lang.org/cargo/)**)

* **Chain SDKs**: Solana (native or Anchor), Polkadot SDK, NEAR SDK, CosmWasm libraries. (**[Solana Rust](https://solana.com/docs/programs/rust)**, **[Anchor](https://www.anchor-lang.com/)**, **[Polkadot SDK](https://polkadot.com/platform/sdk/)**, **[NEAR docs](https://docs.near.org/)**, **[CosmWasm Book](https://book.cosmwasm.com/)**) 

**How much is it going to cost me?**

The language, toolchains, and most frameworks are free/open-source. You’ll pay for compute (compiles/tests), audits, and deployment infra. If you’re on Solana, for example, devnet time is free; mainnet fees are tiny per transaction, but audits are where the real wallet weight is.

**Can you give me an example?**

A tiny Rust smart contract in the Cosmos world using CosmWasm (abbreviated for clarity):

```rust
// Cargo.toml includes cosmwasm-std = "1"
use cosmwasm_std::{entry_point, DepsMut, Env, MessageInfo, Response, StdResult, Binary};
use cosmwasm_std::{to_binary};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct State { pub count: u64 }

static mut STATE: Option<State> = None;

#[entry_point]
pub fn instantiate(_deps: DepsMut, _env: Env, _info: MessageInfo, _msg: ()) -> StdResult<Response> {
    unsafe { STATE = Some(State { count: 0 }); }
    Ok(Response::new())
}

#[entry_point]
pub fn execute(_deps: DepsMut, _env: Env, _info: MessageInfo, _msg: ()) -> StdResult<Response> {
    unsafe { if let Some(s) = STATE.as_mut() { s.count += 1; } }
    Ok(Response::new())
}

#[entry_point]
pub fn query(_deps: DepsMut, _env: Env, _msg: ()) -> StdResult<Binary> {
    let c = unsafe { STATE.as_ref().map(|s| s.count).unwrap_or(0) };
    to_binary(&c)
}
```

This is intentionally minimized to show the entry points and flow; real contracts use proper storage helpers and types from `cosmwasm_std`. See the **[CosmWasm Book](https://book.cosmwasm.com/)** for production patterns. 

**Is it the subject of any famous art?**

Not in museums (yet), but code golf threads and Rustacean Ferris crabs have inspired more fan art than you’d expect. Your compiler errors could hang in MoMA, if angst counts as art.

**Does it work well with AI? What tools?**

* **Model serving/inference in Rust:** **[tch-rs (PyTorch bindings)](https://github.com/LaurentMazare/tch-rs)**

* **Native Rust frameworks:** **[Burn](https://burn.dev/)** (with **[GitHub](https://github.com/tracel-ai/burn)**)
  These keep latency low for services like on-chain oracles, proof verifiers, or order-matching engines. 

**Any other interesting tidbits?**

* Rust powers serious infra: AWS’s **[Firecracker](https://github.com/firecracker-microvm/firecracker)** under the hood of serverless, and Cloudflare’s modern proxies like **[Oxy](https://blog.cloudflare.com/introducing-oxy/)**. If “borrowing rules” sound academic, remember they’re guarding traffic and VMs at global scale. 

**Wrap-up (and why you might pick Rust next):**

If you care about speed, safety, and writing contracts/services that don’t develop mysterious 3 a.m. gremlins, Rust is that dependable friend who drives you home, reminds you to hydrate, and files your gas receipts. It takes some ramp-up, but the payoff shows up in production.

If this helped, **follow for Episode 5 (Move)** and tell me what you’re building. Got a Rust war story or a chain you want covered next? Drop it in the comments—let’s compare scars and benchmarks.

**[Art Prompt (Pop Art):](https://lumaiere.com/?gallery=pop-art)**
A bold, high-contrast portrait cropped to the shoulders, flat planes of neon magenta and lemon yellow, halftone dots rippling across shadows, thick black contour lines snapping around lips and eyelids, a comic-panel speech bubble drifting off-frame, glossy highlights that look screen-printed, and a playful, slightly ironic stare that breaks the fourth wall—color blocking in clean rectangles and a punchy, poster-worthy composition.

**[Video Prompt:](https://www.tiktok.com/@davelumai/video/7570480163440299294)**
Start with a rapid jump-cut from blank white to saturated neon blocks, snapping into a close-up of the stylized face as halftone dots animate in waves across the shadows; cut on the beat to kinetic text fragments that pop like comic onomatopoeia; interleave 0.3-second flashes of offset screen-print layers misregistered for a jittery pop look; finish with a whip-zoom to the eyes and a freeze-frame poster reveal, then a fast stinger logo.

**Songs to pair with the video:**

* K – Cigarettes After Sex
* Burnt – Kiasmos

Follow for more posts, art drops, and experiments. Comment with your favorite Rust tip or the chain you want me to roast (lovingly) next.
