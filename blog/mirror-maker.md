# MirrorMaker: The Busy Bee of Cross-Cluster Kafka

If you’ve ever needed the same messages to buzz happily in two different [Kafka](https://kafka.apache.org/) clusters—say, one in your data center and one in the cloud—[MirrorMaker](https://cwiki.apache.org/confluence/display/KAFKA/KIP-382%3A+MirrorMaker+2.0) is the little worker that carries nectar across hives. It’s Kafka’s native toolkit for copying topics, syncing consumer group offsets (so your apps can resume reading in the other cluster), and keeping multi-region or hybrid-cloud setups from turning into a game of telephone.

**What is it?**
MirrorMaker is Kafka’s way to replicate data between clusters. The modern incarnation (MirrorMaker 2, or “MM2”) is built on Kafka Connect and is made of three connectors: MirrorSourceConnector (copies topics), MirrorCheckpointConnector (translates and syncs consumer offsets), and MirrorHeartbeatConnector (keeps an eye on liveness). Start it up, point source → target, and it starts mirroring topics (often with a prefix like `us-west.topic-name`).

**Is it still relevant?**
Yep. Even with shiny alternatives, MM2 remains a solid, open-source default for disaster recovery, cloud migrations, and multi-region read replicas. If you’re all-in on stock Kafka or running Kubernetes (hello, [Strimzi](https://strimzi.io/docs/operators/latest/using.html#type-KafkaMirrorMaker2-reference)), MM2 fits right in.

**What are its pros and cons?**
**Pros:**

* Native and free, ships with Kafka (no extra license).
* Built on Kafka Connect (scales horizontally, operationally familiar).
* Offset translation makes failover less painful.
* Works well with operators like Strimzi for K8s.

**Cons:**

* It’s eventually consistent—expect some lag.
* Not a silver bullet for active-active with strict exactly-once semantics across clusters.
* Operational tuning matters (filters, ACL sync, topic configs).
* Some advanced enterprise niceties live in paid tools (monitoring/observability out of the box, more guardrails).

**Strengths and weaknesses?**
Strengths: simple mental model, proven in the wild, aligns with Kafka’s ecosystem, great for DR/migration.
Weaknesses: not built for zero-lag or cross-cluster transactions; needs careful filtering and naming conventions; observability requires adding your own stack.

**What is it used for?**

* Disaster recovery and failover drills.
* Cloud onboarding (mirror from on-prem to cloud).
* Regional fan-out for faster local reads.
* Migrating clusters with minimal downtime.

**Can you give me an example?**
Below is a tiny “two-connector” example using Kafka Connect’s REST API. It mirrors all topics from cluster A to B (with a prefix), and syncs consumer offsets.

```bash
# Mirror the topics (A -> B)
curl -s -X POST localhost:8083/connectors -H "Content-Type: application/json" -d '{
  "name": "mm2-a-to-b-source",
  "config": {
    "connector.class": "org.apache.kafka.connect.mirror.MirrorSourceConnector",
    "tasks.max": "4",
    "source.cluster.alias": "A",
    "target.cluster.alias": "B",
    "source.cluster.bootstrap.servers": "a1:9092,a2:9092",
    "target.cluster.bootstrap.servers": "b1:9092,b2:9092",
    "topics": ".*",
    "replication.policy.class": "org.apache.kafka.connect.mirror.DefaultReplicationPolicy",
    "refresh.topics.interval.seconds": "60"
  }
}'

# Sync consumer group offsets (A -> B)
curl -s -X POST localhost:8083/connectors -H "Content-Type: application/json" -d '{
  "name": "mm2-a-to-b-checkpoints",
  "config": {
    "connector.class": "org.apache.kafka.connect.mirror.MirrorCheckpointConnector",
    "tasks.max": "1",
    "source.cluster.alias": "A",
    "target.cluster.alias": "B",
    "source.cluster.bootstrap.servers": "a1:9092,a2:9092",
    "target.cluster.bootstrap.servers": "b1:9092,b2:9092",
    "groups": ".*",
    "emit.checkpoints.enabled": "true",
    "emit.checkpoints.interval.seconds": "30"
  }
}'
```

**What are the alternatives?**

* [**Cluster Linking** (Confluent Platform)](https://docs.confluent.io/platform/current/multi-dc-deployments/cluster-linking/index.html): zero-copy, broker-level links between clusters, fewer moving parts for many use cases.
* **[Confluent Replicator](https://docs.confluent.io/platform/current/multi-dc-deployments/replicator/index.html):** enterprise-grade, Connect-based with additional controls and tooling.
* **Strimzi’s MirrorMaker 2 operator** (Kubernetes): batteries-included management.
* **Uber’s uReplicator** and **LinkedIn’s Brooklin:** alternative replication frameworks used at scale.

**Is it the subject of any famous art?**
Not MirrorMaker specifically. But the idea of mirrored worlds has definitely inspired art—peek at [M. C. Escher’s “Hand with Reflecting Sphere”](https://en.wikipedia.org/wiki/Hand_with_Reflecting_Sphere) and tell me that doesn’t feel like a data pipeline staring back at you.

**How popular is it? Is it going up or down? When was it most popular?**
Popularity is steady wherever teams run vanilla Kafka and want first-party, open-source replication. In managed Kafka ecosystems (especially Confluent), Cluster Linking has eaten into MM2’s “default choice” status. MM2’s popularity surged after it replaced the original (pre-Connect) MirrorMaker; since then it’s been a dependable workhorse rather than a trending fad.

**What is its history? Who invented it?**
Kafka started at LinkedIn; replication needs were there from the early days. The original MirrorMaker shipped as a Scala tool. MM2 emerged via KIP-382, rebuilding MirrorMaker on Kafka Connect to modernize configuration, scaling, and extensibility.

**What companies use it the most?**
Any organization running upstream Kafka across regions without an enterprise license is a likely user: SaaS platforms with multi-region footprints, e-commerce analytics, IoT fleets splitting hot/warm paths, and teams doing lift-and-shift migrations.

**Is it similar to anything else?**
Conceptually, it’s like database replication—but for Kafka logs. Functionally it sits alongside alternatives like Cluster Linking or specialized data mover frameworks.

**Does it work well with AI?**
Indirectly, yes. MM2 helps centralize or regionalize event streams that feed feature stores, model training pipelines, and near-real-time inference. It doesn’t “do AI,” it just keeps the data flowing to wherever your models live.

**What tech stack does it work with?**
Java (JVM), Kafka Connect, standard Kafka brokers. Operational pals include Kubernetes (Strimzi), Prometheus/Grafana for metrics, and your favorite logging stack. It plays nicely with Terraform/Helm for infra.

**What tools work best with it?**

* **Strimzi** for K8s deployments.
* **Cruise Control** for broker balancing (not replication, but complementary).
* **Prometheus/Grafana** for metrics; **OpenTelemetry** for traces/logs.
* **ACL/config sync helpers** or your own infra-as-code to keep configs aligned.

**Any other interesting tidbits?**

* Topic prefixing (`A.topic`) prevents name collisions and makes routing obvious.
* You can selectively mirror topics with regexes to keep noise down.
* Offset checkpoints make consumer failover sane—test this regularly like a fire drill.
* Don’t forget to mirror **schemas** (Schema Registry) and **ACLs/configs** policies alongside topics, or you’ll discover “fun” surprises during failover.

---

**[Art Prompt (Abstract Minimalism)](https://lumaiere.com/?gallery=abstract-minimalism):**
A balanced field of quiet color planes arranged as interlocking rectangles, thin dividing lines calibrating space like a soft grid; a restrained palette of smoky grays, warm off-white, and a single ember-red block that hums at low volume; edges appear hand-tuned with barely visible feathering, surfaces matte and absorbent; composition nests a dominant vertical band on the left against a lighter, breathing expanse, inviting stillness; the mood is contemplative, poised between order and human touch, as if silence itself had structure.

**[Video Prompt](https://www.tiktok.com/@davelumai/video/7559420778169503007):**
Begin with the composition already assembled: rectangles gently breathe—subtle scale pulses under 2 seconds—while the red block softly advances and recedes on the Z-axis; introduce micro-parallax on the dividing lines, letting them glide a few pixels to suggest hand-drawn drift; add a slow exposure-like shimmer along edges, as if pigment is settling; midway, rotate the whole grid by 3 degrees and snap it back, a crisp visual hiccup; end by letting the red block fade to a dim ember while the background lifts one stop of brightness, holding for a clean loop.

**Two songs to vibe with the motion:**

- Light Patterns – Jon Hopkins & Kelly Lee Owens
- Solace – Ólafur Arnalds & Nils Frahm

If this was helpful, follow for more experiments and drop your take in the comments—what’s your favorite way to keep Kafka in sync without losing sleep?
