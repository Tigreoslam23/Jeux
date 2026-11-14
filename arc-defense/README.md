# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.23**.

Play: https://tigreoslam23.github.io/Jeux/arc-defense/

## Campaign 01 — First Contact

The default mode opens the campaign map. **Stage 01: The Relay** is playable.
Stages 02–05 are explicitly marked as in preparation or planned.

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
```

The second check runs the actual eight-wave combat loop with legal purchases
and upgrades, verifies the elite finish and ensures progression is saved
without overwriting the original Challenge record.
