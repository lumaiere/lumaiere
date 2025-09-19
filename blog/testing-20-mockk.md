# MockK – Kotlin’s Type-Safe Mocking Dream

If your tests spend more time arguing with your mocks than testing your code, MockK shows up like the friend who speaks fluent Kotlin and orders for the whole table. It’s a modern mocking library purpose-built for Kotlin, with first-class support for coroutines, final classes, object/singleton/static calls, and even top-level and extension functions. Start here: [https://mockk.io](https://mockk.io) and the GitHub repo: [https://github.com/mockk/mockk](https://github.com/mockk/mockk).

---

## What is it?

MockK is a Kotlin-native mocking library (JVM/Android) that lets you stub behavior (`every { ... } returns ...`), verify calls (`verify { ... }`), mock suspend functions (`coEvery`/`coVerify`), and handle Kotlin-specific realities like final classes and extension functions without gymnastics.

---

## Is it still relevant?

Yes—very. It shipped a recent release (**1.14.5** on **July 16, 2025**), sits around **5.6k GitHub stars**, and appears in Android’s own testing docs alongside [Mockito](https://site.mockito.org/?utm_source=chatgpt.com) as a recommended option. Active ecosystem integrations include Spring (via [SpringMockK](https://github.com/Ninja-Squad/springmockk?utm_source=chatgpt.com)) and [Quarkus](https://github.com/quarkusio/quarkus?utm_source=chatgpt.com).

---

## Pros and cons (aka “Will it spark joy?”)

**Pros**

* Idiomatic Kotlin API. Handles final classes, objects, static/top-level and extension functions, and coroutines.
* BDD aliases (`given/then`, `coGiven/coThen`) and useful annotations (`@MockK`, `@RelaxedMockK`, `@InjectMockKs`).
* Plays nicely with [JUnit 5](https://medium.com/stackademic/junit-javas-test-lab-coat-ef3a614b5686), [Kotest](https://kotest.io/?utm_source=chatgpt.com), and [`kotlinx-coroutines-test`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/).

**Cons**

* Can’t mock **inline** functions; some spy/static scenarios need JVM `--add-opens` flags; spying on suspending functions may surprise you.
* Kotlin Multiplatform isn’t the sweet spot—look at **[Mockative](https://github.com/mockative/mockative?utm_source=chatgpt.com)** or **[Mokkery](https://mokkery.dev/?utm_source=chatgpt.com)** if you’re cross-platform.

---

## Strengths and weaknesses (speed-round)

* **Strengths:** Kotlin-first DSL, coroutine helpers, extension/static/object/constructor mocking, smart argument capturing, BDD style.
* **Weaknesses:** A few JDK/inline caveats; bytecode trickery adds overhead compared to pure fakes.

---

## What is it used for?

Unit and integration tests in Kotlin/JVM and Android projects—especially when you need to stub coroutines, intercept calls on final classes, or mock top-level/extension functions without redesigning your code.

---

## A compact example (coroutines + captures + answers)

```kotlin
import io.mockk.*
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

// System under test
data class Charge(val userId: String, val cents: Long)
data class Receipt(val id: String, val ok: Boolean)

interface PaymentApi {
    suspend fun charge(c: Charge): Receipt
}

class BillingService(private val api: PaymentApi) {
    suspend fun bill(userId: String, dollars: Int): Receipt =
        api.charge(Charge(userId, dollars * 100))
}

class BillingServiceTest {

    @Test
    fun `bills in cents, verifies call order, and derives answers`() = runTest {
        val api = mockk<PaymentApi>()
        val captureCharge = slot<Charge>()

        coEvery { api.charge(capture(captureCharge)) } answers {
            val c = captureCharge.captured
            if (c.cents < 200) Receipt("r-declined-${c.userId}", ok = false)
            else Receipt("r-ok-${c.userId}", ok = true)
        }

        val svc = BillingService(api)

        val r1 = svc.bill("sam", 1)
        val r2 = svc.bill("jules", 5)

        assertEquals(false, r1.ok)
        assertEquals(true, r2.ok)

        coVerifyOrder {
            api.charge(Charge("sam", 100))
            api.charge(Charge("jules", 500))
        }
        confirmVerified(api)
    }
}
```

Tip: for coroutine tests use `runTest` from `kotlinx-coroutines-test` (virtual time, no sleeps).

---

## Alternatives

* [Mockito](https://site.mockito.org/) (plus [mockito-kotlin](https://github.com/mockito/mockito-kotlin)): battle-tested, great in mixed Java/Kotlin codebases.
* [Kotest](https://kotest.io/): a full testing framework with assertions/property testing.
* [Mockative](https://github.com/mockative/mockative) and [Mokkery](https://github.com/lupuuss/Mokkery): Kotlin Multiplatform options.

---

## Is it the subject of any famous art?

Not unless you hang conference slides in the Louvre. But the unofficial **MockK Guidebook** has become the art gallery of practical nuggets: [https://notwoods.github.io/mockk-guidebook/docs/mocking/answers/](https://notwoods.github.io/mockk-guidebook/docs/mocking/answers/).

---

## How popular is it? Going up or down?

It’s steady—active releases, stars on GitHub, used in Spring/Quarkus/Android stacks. Popularity is stable for JVM Kotlin, with [KMP-specific mock libraries](https://chatgpt.com/share/68cb6c23-b9a8-8010-892a-8d841bb44da6) rising alongside it.

---

## When was it most popular?

Since its 2017 debut, MockK has stayed relevant and is still current with 2025 releases. Its adoption closely followed Kotlin’s mainstreaming on Android and server-side.

---

## History & “who invented it?”

Created by **[Oleksiy Pylypenko](https://x.com/oleksiyp)**, later maintained by the community.

---

## Who uses it?

Android teams, Kotlin server-side shops, Spring Boot and Quarkus projects. Basically, if you’re in Kotlin/JVM land, odds are you’ve run into it.

---

## Similar to?

Mockito, EasyMock, PowerMock—but with Kotlin-native DSL and coroutine support.

---

## Does it work well with AI?

Yes. You can stub your `LlmClient` or embedding service, test retries/timeouts deterministically, and keep your CI free of API calls.

---

## Tech stack & best-buddy tools

* Kotlin/JVM, Android
* JUnit 5, Kotest
* `kotlinx-coroutines-test`
* SpringMockK, Quarkus MockK

---

## Other interesting tidbits

* Mock constructors you don’t own with `mockkConstructor`.
* Verify call sequences/order.
* Argument capture with `slot()`/`capturingSlot()`.
* Spring Boot: use [SpringMockK](https://github.com/Ninja-Squad/springmockk).
* Quarkus: [Quarkus MockK Extension](https://quarkiverse.github.io/quarkiverse-docs/quarkus-mockk/dev/index.html).

---

## Quick setup links

* [https://mockk.io](https://mockk.io)
* [https://github.com/mockk/mockk](https://github.com/mockk/mockk)
* [https://central.sonatype.com/artifact/io.mockk/mockk](https://central.sonatype.com/artifact/io.mockk/mockk)
* [https://developer.android.com/training/testing/local-tests](https://developer.android.com/training/testing/local-tests)

---

If this helped, drop a comment with your favorite MockK trick, and hit follow for the next episode in the series.

---

**[Art Prompt (Baroque)](https://lumaiere.com/?gallery=baroque2):**
A candlelit interior unfolds in deep umbers and warm ochres; a single off-screen light carves faces from blackness with dramatic chiaroscuro. Figures cluster around a rough wooden table, hands mid-gesture, fabric catching razor-thin highlights; a diagonal composition guides the eye from shadowed doorway to illuminated faces. Oil-paint texture is visible—thick impasto on highlights, feathered glazing in the darks. Subtle dust motes drift through the beam, background dissolving into velvety shadow; atmosphere tense yet reverent, as if time itself is holding its breath.

**[Video Prompt](https://www.tiktok.com/@davelumai/video/7551257383759088927):**
Create a 9:16, 12–15s loop of the scene above. Begin with a slow dolly from the shadowed doorway toward the candlelit table; introduce gentle particulate drift in the light beam. Add micro-gestures—fingers tapping, cloth shifting, a flicker in the flame—while keeping overall motion restrained. Use a subtle parallax on foreground silhouettes, then a shallow rack-focus shift from the nearest figure to the furthest illuminated face. Finish with a slight tilt up into darkness so the loop can re-start seamlessly.

**Songs to pair with the video:**

* A Moment Apart – ODESZA
* Low Mist (Day One) – Ludovico Einaudi

**Come say hi:** Tell me what you’re mocking this week, and follow for more test-friendly mischief.
