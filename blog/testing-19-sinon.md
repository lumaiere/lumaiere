# Sinon: Spies, Stubs, and JavaScript Shenanigans (Without the Hangover)

If your tests have ever whispered “are we sure that function really got called?” or “I wish time would move faster,” Sinon is the friend who shows up with receipts and a stopwatch. It’s a lightweight library for spies, stubs, mocks, and fake timers that plays nicely with any test runner. You bring Mocha, Jest, Vitest, or AVA; Sinon brings the mischief.

**Product:** [sinonjs.org](https://sinonjs.org/) • [GitHub](https://github.com/sinonjs/sinon)

**Also useful:** [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), [MSW](https://mswjs.io/), [Nock](https://github.com/nock/nock), [testdouble.js](https://github.com/testdouble/testdouble.js), [ts-mockito](https://github.com/NagRock/ts-mockito)

---

## What is it?

A small, focused toolkit for **spies** (recording calls), **stubs** (overriding behavior), **mocks** (expectations + verification), and **fake timers** (controlling `setTimeout`, `Date`, and friends). It’s unopinionated and framework-agnostic: use it with Node or the browser, TypeScript or JavaScript.

## Is it still relevant?

Yes. Even though Jest/Vitest ship with built-in mocking, Sinon remains a great choice when:

* You’re not using Jest/Vitest (hello, Mocha/Chai/AVA/Jasmine).
* You need battle-tested fake timers and fine-grained control.
* You want a library that doesn’t drag along a whole test runner.

## Pros and cons (speed round)

**Pros:** small surface area, predictable behavior, great timers, works anywhere, mature.
**Cons:** you manage your own cleanup; module-level mocking patterns need helpers (e.g., proxyquire/rewiremock) in Node ESM; if you over-stub real systems your tests can drift from reality.

## Strengths and weaknesses?

**Strengths:** clear spying, powerful stubbing, excellent `useFakeTimers`, deterministic testing for time-based logic, and a flexible sandbox to keep tests tidy.

**Weaknesses:** ecosystem sprawl when you also need network or module mocking; mocks can become brittle if you assert on every minor call.

## What is it used for?

* Verifying that callbacks/handlers were called with specific args.
* Stubbing network calls, DB clients, or clock-based logic to run fast and deterministically.
* Testing retries, debouncing, backoff, and timeouts without napping through a `setTimeout`.

## Can you give me an example?

Here’s a compact demo using Mocha + Chai + Sinon to stub `fetch`, spy on a callback, and fast-forward time:

```js
// test/userService.test.js
import { expect } from "chai";
import sinon from "sinon";

// SUT: a tiny user service that fetches, caches for 5s, and notifies via callback
const cache = { data: null, ts: 0 };
async function getUser(callback) {
  const now = Date.now();
  if (!cache.data || now - cache.ts > 5000) {
    const res = await fetch("https://example.com/api/user");
    cache.data = await res.json();
    cache.ts = now;
  }
  callback(cache.data);
  return cache.data;
}

describe("user service", () => {
  let sandbox, clock;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    clock = sandbox.useFakeTimers(); // control Date.now() and timers
  });

  afterEach(() => {
    sandbox.restore(); // cleanup spies/stubs/timers
  });

  it("stubs fetch, spies callback, and respects cache timeout", async () => {
    // Arrange: stub fetch to avoid network and return stable data
    const fetchStub = sandbox.stub(global, "fetch").resolves({
      json: async () => ({ id: 42, name: "Taylor" })
    });

    const cb = sandbox.spy();

    // Act: first call hits stubbed network
    const first = await getUser(cb);

    // Assert basics
    expect(fetchStub.calledOnce).to.equal(true);
    expect(cb.calledOnceWithExactly({ id: 42, name: "Taylor" })).to.equal(true);
    expect(first.name).to.equal("Taylor");

    // Act: call again within 5s -> should use cache, not network
    const second = await getUser(cb);
    expect(fetchStub.calledOnce).to.equal(true); // still only one fetch
    expect(cb.calledTwice).to.equal(true);
    expect(second).to.equal(first);

    // Act: advance time beyond cache TTL and call again
    clock.tick(5001);
    const third = await getUser(cb);

    // Assert: fetch again after TTL
    expect(fetchStub.calledTwice).to.equal(true);
    expect(cb.callCount).to.equal(3);
    expect(third).to.deep.equal({ id: 42, name: "Taylor" });
  });
});
```

## What are the alternatives?

* **Jest/Vitest built-ins:** Seamless if you’re already on those runners.
* **testdouble.js:** Clean, friendly API focused on doubles.
* **MSW (Mock Service Worker):** Simulates the network layer realistically for browser/Node.
* **Nock:** Intercepts HTTP in Node for integration-style API tests.
* **ts-mockito:** Type-safe, Mockito-style API for TypeScript.

## Is it the subject of any famous art?

Not unless you count the modernist masterpiece “Assertion Failed: Expected 1 call, got 0.” (Museum gift shop T-shirts pending.)

## How popular is it?

Decade-plus of production use and still widely installed across CI pipelines and enterprise codebases. It’s dependable, not trendy.

## Is popularity going up or down?

Relative share declined with Jest/Vitest growth, but usage remains steady wherever teams prefer mix-and-match tooling or run outside React-centric stacks.

## When was it most popular?

Pre-Jest dominance, roughly mid-2010s, especially in Node + Mocha/Chai ecosystems.

## What is its history?

Created around 2010 by **Christian Johansen**, aligning with the era of modular JS testing and TDD momentum. It’s since moved to an org on GitHub with active maintainers and offshoot packages like `@sinonjs/fake-timers`.

## Who invented it?

Christian Johansen. See the project home: [github.com/sinonjs/sinon](https://github.com/sinonjs/sinon).

## What companies use it the most?

You’ll find it across agencies and product orgs that value custom runner stacks (Mocha/Chai) or maintain legacy systems where swapping runners isn’t practical.

## Is it similar to anything else?

Conceptually overlaps with mocking features in Jest/Vitest and with double libraries like testdouble.js. The big difference: **Sinon is standalone** and focuses on the primitives.

## Does it work well with AI?

Yes. AI assistants happily scaffold Sinon tests (spies/stubs/timers) because the APIs are small and deterministic—great for generating quick coverage on HTTP clients, schedulers, and utility modules.

## What tech stack does it work with?

* **Languages:** JavaScript, TypeScript
* **Runtimes:** Node, browser, Deno (with bundling)
* **Runners:** Mocha, Jest, Vitest, AVA, Jasmine
* **Assertion libs:** Chai, built-in Node `assert`, expect-style libs

## What tools work best with it?

* **Mocha + Chai** for classic ergonomics.
* **MSW/Nock** when your “stub the network” needs a life-like network layer.
* **Sandboxing** (`sinon.createSandbox()`) to centralize cleanup.
* **Fake timers** for deterministic scheduling tests.

## Any other interesting tidbits?

* You can **match arguments** precisely (e.g., `sinon.match({ id: sinon.match.number })`) without brittle full-object comparisons.
* Stubs can **throw**, **callFake**, or **resolve** promises—handy for retry logic and failure-path testing.
* Fake timers save minutes of wall-clock time on suites with heavy timeouts.

---

**[Art Prompt (Impressionism)](https://lumaiere.com/?gallery=impressionist9):**
A sunlit riverside garden at late afternoon, shimmering with soft, broken color; misty blues and pale greens ripple across water while pale yellow light breathes over drifting clouds. Gentle, feathery brushwork dissolves edges; reflections quiver as if the canvas itself were humming. A low footbridge drifts into view, balanced by willow fronds bowing toward the surface. The composition anchors the horizon high, letting luminous water claim the frame; the mood is hushed, serene, and endlessly reflective—air, light, and water melting into a single sigh.

**[Video Prompt](https://www.tiktok.com/@davelumai/video/7550378325185793310):**
Begin on a slow push-in across a luminous water surface, light dapples flickering. Add a subtle parallax of willow branches drifting foreground-right, then a crossfade to a calm footbridge as ripples glide beneath. Introduce gentle camera sway synced to a mellow beat; occasional soft lens flares sweep across the frame. Midway, tilt up to catch warm sky glow, then tilt back to the glittering reflections. End with a 2-second hold for a seamless loop (12–15 seconds total), crisp textures and delicate grain.

**Songs to pair with the video:**

* Dawn – Jean-Michel Blais
* Night Light – Jessie Ware

If this was helpful (or your tests finally stopped gaslighting you), follow and drop a comment with your best “I stubbed it and it worked the first time” story. More writing lives here: [Dave LumAI](https://medium.com/@DaveLumAI)
