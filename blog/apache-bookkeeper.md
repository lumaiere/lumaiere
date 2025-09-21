# Apache BookKeeper: The Ledger Your Streams Secretly Rely On

If your data pipeline were a band, [Apache BookKeeper](https://bookkeeper.apache.org/) would be the drummer: relentlessly on-time, rarely seeking the spotlight, and absolutely essential. It’s a distributed storage service for append-only records—**ledgers**—designed to be fast, durable, and fault-tolerant. Under the hood of [Apache Pulsar](https://pulsar.apache.org/docs/next/concepts-architecture-overview/) and a few lesser-known systems, it quietly keeps your messages consistent and your ops team calm.

---

## What is it?

BookKeeper stores streams of log entries as **ledgers** replicated across **bookies** (storage nodes). You append entries; it fsyncs and replicates before acknowledging. Reads can “tail” the newest entries or fetch historical ranges with consistent ordering. You choose **ensemble size**, **write quorum**, and **ack quorum**, balancing performance and durability. It uses a metadata store (traditionally [ZooKeeper](https://medium.com/@DaveLumAI/zookeeper-the-little-coordinator-that-keeps-big-systems-from-tripping-over-themselves-d2d72f29b650); modern deployments can use alternatives) to track ledger placement and state, as described in the [concepts guide](https://bookkeeper.apache.org/docs/getting-started/concepts/).

## Is it still relevant?

Yes. BookKeeper is the storage engine beneath [Pulsar’s](https://medium.com/@DaveLumAI/pulsar-the-open-source-messaging-system-that-wont-ghost-you-5e7b87ca9c2b) persistent messages and [function state management](https://pulsar.apache.org/docs/next/functions-develop-state/). It continues to ship new releases and remains critical in production for many organizations.

## Strengths and weaknesses

**Strengths**

* Low-latency appends with [fsync + quorum replication](https://chatgpt.com/share/68cdec3a-0440-8010-aa3e-3f2bdb677d79).
* Scales horizontally—just add more bookies.
* Flexible reads: range or tail.
* Mature, proven through Pulsar.
* Good observability with [Prometheus metrics](https://bookkeeper.apache.org/docs/4.8.2/reference/config/#prometheus-metrics-provider-settings).

**Weaknesses**

* Operational complexity: requires careful disk separation ([journal vs ledger](https://chatgpt.com/share/68cded5c-85fc-8010-8ff9-2531dbcf2d2a)) and a metadata store.
* Low-level API: you’ll often meet it through Pulsar instead of directly.
* Tuning matters—quorum settings and IO isolation can make or break performance.

## What is it used for?

* Persistent message storage in Pulsar.
* Write-ahead logs in projects like [HerdDB](https://herddb.org/).
* Replicated log abstractions through [DistributedLog](https://bookkeeper.apache.org/docs/api/distributedlog-api/).

## A quick example (Java)

```java
import org.apache.bookkeeper.client.*;
import java.nio.ByteBuffer;
import java.util.Enumeration;

public class BKQuickstart {
  public static void main(String[] args) throws Exception {
    byte[] pwd = "secret".getBytes();
    try (BookKeeper bk = new BookKeeper("127.0.0.1:2181")) {
      LedgerHandle lh = bk.createLedger(BookKeeper.DigestType.MAC, pwd);
      ByteBuffer buf = ByteBuffer.allocate(4);
      for (int i = 0; i < 10; i++) {
        buf.putInt(0, i);
        lh.addEntry(buf.array());
      }
      long id = lh.getId();
      lh.close();
      LedgerHandle rh = bk.openLedger(id, BookKeeper.DigestType.MAC, pwd);
      Enumeration<LedgerEntry> entries = rh.readEntries(0, 9);
      while (entries.hasMoreElements()) {
        System.out.println(ByteBuffer.wrap(entries.nextElement().getEntry()).getInt());
      }
      rh.close();
    }
  }
}
```

## Alternatives

* **[Apache Kafka](https://kafka.apache.org/)** and [Redpanda](https://www.redpanda.com/) bundle messaging and storage directly.
* **[Pravega](https://cncf.pravega.io/)** provides tiered stream storage and sometimes even uses BookKeeper internally.
* **[LogDevice](https://github.com/facebookarchive/LogDevice)** (archived) was Meta’s log storage project.

## History

Created at Yahoo around 2009, BookKeeper became open source in 2011 and graduated as an Apache top-level project in [2015](https://news.apache.org/foundation/entry/the_apache_software_foundation_announces68). Engineers like [Flavio Junqueira](https://x.com/fpjunqueira), [Ben Reed](https://x.com/BenTheSpartan), and [Ivan Kelly](https://github.com/ivankelly) shaped its early development.

## Who uses it?

Anyone using Pulsar with durability enabled is relying on BookKeeper. See Pulsar’s [powered by page](https://pulsar.apache.org/powered-by/) for adopters in telecom, finance, and streaming.

## Popularity

BookKeeper’s relevance rises and falls with Pulsar’s growth. It isn’t a household name like Kafka, but in the infra world it’s a quiet workhorse, humming along steadily.

## With AI?

Indirectly, yes. It shines at providing durable event streams and state storage for streaming AI/ML pipelines. Pulsar Functions with BookKeeper-backed state are a natural fit.

## Stack and tools

* Language: Java client API.
* Metadata: ZooKeeper or alternatives.
* Deployment: Bare metal or Kubernetes.
* Observability: Prometheus and Grafana dashboards.

---

**Songs to set the mood**

* *Atlas Hands* – Benjamin Francis Leftwich
* *Signal* – Sylvan Esso

**[Art Prompt (Impressionism)](https://lumaiere.com/?gallery=impressionist9):**
A luminous riverside at dusk, dappled reflections shimmer in rippling currents, strokes of lavender and peach melting into cool blues; figures strolling under parasols blur into hazy silhouettes, their outlines softened by atmospheric light; the sky swells with pastel clouds tinged in coral and apricot, each brushstroke spontaneous yet harmonious; mood serene and fleeting, as if capturing a heartbeat of nature’s glow just before nightfall.

**[Video Prompt:](https://www.tiktok.com/@davelumai/video/7551947834262555934)**
The camera bursts into life with a shimmer of water, sunlight scattering like diamonds across gentle ripples. Rapid cuts follow footsteps along a riverside path, parasols tilting into view, each scene blurred with impressionistic transitions. The lens flares pastel tones—lavender, coral, peach—before pulling back to reveal the glowing horizon. Sync every cut to a soft percussive beat, ending on a lingering shot of sky dissolving into watercolor.

---

## Friday Night Laughs

A database engineer walks into a bar and says, “Give me a drink, fast — I need low latency.”

The bartender nods, pours a shot, and slides it down the bar. It arrives instantly.

The engineer grins, “Perfect! Now replicate it three more times for durability.”

The bartender shrugs, lines up three identical shots, and pushes them over.

The engineer frowns, “Wait… one of them’s missing.”

The bartender points to a guy at the end of the bar already drinking.

“Relax,” he says. “That’s just eventual consistency.”

---

Got BookKeeper stories of your own? Drop them in the comments—I’d love to hear them. And hit follow for more deep dives and a few questionable puns. More writing here: [https://medium.com/@DaveLumAI](https://medium.com/@DaveLumAI)

