# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.25**.

Play: https://tigreoslam23.github.io/Jeux/arc-defense/

## Campaign 01 — First Contact

The default mode opens the campaign map. **The Relay**, **Armor Front**, and **Swarm Signal** are playable.
Clear each stage to unlock the next. Stages 04–05 remain planned.

Stage 01 uses a fixed, continuous route without boosts or teleportation.
Preparation shows faint route chevrons. Start with **340 energy and 20 core**.
Defense is rebuilt on each attempt.

| Wave | Formation | Orbs | Trions | Hexions | Interval |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | First contact | 10 | 0 | 0 | 1.00 s |
| 2 | Trion scouts | 10 | 4 | 0 | 0.90 s |
| 3 | Hold the line | 12 | 6 | 0 | 0.72 s |
| 4 | Heavy signatures | 10 | 6 | 2 | 0.85 s |
| 5 | Close formation | 12 | 8 | 3 | 0.62 s |
| 6 | Armored column | 10 | 10 | 4 | 0.75 s |
| 7 | Fast flank | 12 | 10 | 4 | 0.60 s |
| 8 | Elite vanguard | 8 | 8 | 8 | 0.72 s |

The 157 enemies finish with three reinforced Hexions; Stage 01 has no Titan.
Freezer unlocks after wave 2, E-Link after wave 4, and Pulse/Boomerang after
wave 6. Campaign technologies stay unlocked after retries and reloads.
Pulse's costs, statistics and combat behavior have not changed.

Victory earns one star, at least 15 core earns two, and 20 core earns three.
Stage bests and technologies use `arc_campaign_v1`; the original Challenge
record is kept separately. Storage failure still permits session play.

## Stage 02 — Armor Front

A distinct fixed route, **520 starting energy**, 20 core and ten authored waves.
Previously unlocked technologies carry over; towers and run energy reset.
The 231 enemies introduce more armor, increasingly dense Hexion formations,
and one **Bastion** as the last enemy of wave 10.

Bastion has 100 HP at Intermediate (82 Beginner, 118 Advanced), six plates
with 3 HP each at Intermediate, and a larger golden silhouette. It resists
50% of freezing strength and can be grappled. It has no Titan second phase. After a capture ends, it has a three-second
grapple shield (simulation time, paused with gameplay). Freezer and damage
remain effective; ordinary enemies keep their existing capture rules.
Destroy it to finish the stage; escape defeats the core. Its health bar
shares the existing boss HUD and honors pause/audio controls.

Results and stars are stored per stage. The Stage 01 victory screen offers
**Next · Stage 02**. Retries keep the selected stage; the campaign map
shows locked/unlocked state and each stage's best result.

## Stage 03 — Swarm Signal

A new fixed continuous route, **600 starting energy**, 20 core and twelve
waves totaling **417 enemies**. More numerous Orbs and Trions arrive in dense
formations (20–46 enemies per wave, intervals from 0.58 to 0.29 seconds),
with a gradually increasing Hexion escort. All campaign technologies carry
over. Pulse and every tower's base costs and statistics remain unchanged.

**Nexus** is the final enemy of wave 12: a large violet triangular boss with
three reinforced plates. At Intermediate it has 160 HP and 5 HP per plate;
Beginner/Advanced multiply both by 0.82/1.18. It resists 65% of freezing
strength. It can be captured, then gets the same three-second grapple shield
as Bastion. At half HP, Overdrive increases movement by 22% and rotation to
1.15 without restoring health or plates. The boss score gains its phase-II
arrangement. Defeat Nexus to clear the stage; its escape defeats the core.

Stage 02's victory screen now offers **Next · Stage 03**. All three stage
bests persist independently. Stage 03 shows Stage 04 as planned; three-star
victories no longer suggest replaying to earn stars already obtained.

## Original 20-wave Challenge

Use the campaign-map button or **Options → 20-wave Challenge · Titan**.
Direct entry is available with `?mode=challenge`.
The procedural maps, exploration unlocks, twenty waves and Titan encounter
remain available, with the existing device record.

## Titan and Boss Test

Titan arrives after the last enemies of Challenge wave 20. Destroy it to win.
At half health its six armor plates spread and its rotation/movement accelerate.
Its original synthesized score gains a second-phase arrangement. Existing
music/effects volume, mute and pause controls apply.

**Options → Boss Test** resets a Challenge map with 3,500 energy and all towers.
Build, then select **Release Boss**. **Load sample defense** costs 3,125 energy.
**Retry Boss** restores the test; **Return to Campaign** returns to the previous
mode. Boss Test changes neither campaign progression nor Challenge records.

Titan resists 78% of freezing strength, cannot be grappled, and ignores boosts.
Tunnel protection and the ordinary tower damage rules apply.

## Checks

From the repository root:

```sh
node arc-defense/tests/engine-regressions.cjs
node arc-defense/tests/stage-one-simulation.cjs
node arc-defense/tests/stage-two-simulation.cjs
node arc-defense/tests/stage-three-simulation.cjs
```

The second check runs the actual eight-wave combat loop with legal purchases
and upgrades, verifies the elite finish and ensures progression is saved
without overwriting the original Challenge record.

The Stage 02 simulation uses legal purchases and earned upgrades, finishing
all ten waves and Bastion with 15 core. This is a reproducible baseline,
not a guarantee for every strategy. Stage 01 retains its 12-core baseline.

The Stage 03 simulation completes twelve waves with 20 core, 417 kills,
and 332 energy. Its nine-defense sample uses two E-Links and upgrades them
with earned energy during the boss encounter. It verifies Nexus Overdrive
and a grapple shield following an actual capture. Results describe this
specific strategy and do not guarantee equivalent outcomes for other builds.

Boss phase/death particles now retain their own duration and a nonnegative
rendered radius; a canvas regression covers the full lifetime of each ring.
