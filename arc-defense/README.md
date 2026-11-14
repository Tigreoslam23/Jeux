# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.26**.

Play: https://tigreoslam23.github.io/Jeux/arc-defense/

## Campaign 01 — First Contact

The campaign map opens by default. Clear each stage to unlock the next.
Stages 01–04 have fixed authored routes: retrying preserves the trajectory,
while towers, run energy, and core integrity reset. Stage 05 remains planned.

| Stage | Name | Waves | Enemies | Starting energy | Finish |
| --- | --- | ---: | ---: | ---: | --- |
| 01 | The Relay | 8 | 157 | 340 | Three reinforced Hexions |
| 02 | Armor Front | 10 | 231 | 520 | Bastion mini-boss |
| 03 | Swarm Signal | 12 | 417 | 600 | Nexus boss |
| 04 | Crosscurrent | 12 | 428 | 650 | Four armored elite Hexions |

All stages begin with 20 core. Stage 04 has a distinct crossing route and
increasingly armored formations; the final four Hexions each have 32 HP
at Intermediate and six plates. Stage 01–03 wave data remains unchanged.

Freezer unlocks after Stage 01 wave 2, E-Link after wave 4, and
Magnetar/Boomerang after wave 6. Technologies persist across retries and
stages. **Magnetar replaces Pulse** and inherits its existing technology
unlock (`area` internally); old device unlocks remain valid.

One star is awarded for victory, two for at least 15 core, and three for 20.
Stage bests and technologies are stored in `arc_campaign_v1`. Results remain
independent per stage and separate from the original Challenge record.
Unavailable storage permits session play and reports unsaved results.

## Magnetar — twin magnetic compression

A violet infinity-shaped field binds **two** available enemies in range.
Both keep moving and rotating. They become protected immediately during the
one-second drawing phase and stay protected throughout compression.
Precision, Rapid, Ricochet, E-Link, Boomerang, Freezer and Grapple cannot target,
damage, slow or capture them, including projectiles already in flight.
Other Magnetars cannot take over enemies already bound or grappled.

On completion, both lose every armor plate (including durable boss plates)
and exactly **25% of maximum HP**. Current HP never goes below zero. Other
towers can target them again after release. No solo-target fallback is used.

| Level | Range, cells | Drawing | Compression | Recovery |
| --- | ---: | ---: | ---: | ---: |
| 1 | 3.0 | 1 s | 4 s | 2 s |
| 2 | 3.2 | 1 s | 3 s | 2 s |
| 3 | 3.4 | 1 s | 2.25 s | 2 s |
| 4 | 3.6 | 1 s | 1.6875 s | 2 s |
| 5 | 3.8 | 1 s | 1.265625 s | 2 s |

Construction costs **180 energy**. Base upgrade costs are 105/145/205/275,
with the existing campaign upgrade multipliers applied. Compression duration
is reduced multiplicatively by 25% per level. An active pair retains the
level snapshot from its start; upgrades affect the next pair. A tower runs
one pair at a time and begins recovery on release. At level 5, the existing
Range specialization adds 22% range; Reset reduces recovery by 18% and does
not change the fixed quarter-health damage or the compression sequence.

If either partner exits, disappears, or enters a tunnel, or the tower is sold,
the pair cancels without damage. The surviving target is immediately freed.
Out-of-range movement does not break an established field. All timers use
simulation time, obey pause, and follow the selected game speed.

The violet eight follows both moving targets, forms over one second, and
tightens during compression. The tower uses an infinity glyph. Selected
controls show the current compression time and the next upgrade's duration.

## Campaign bosses

**Bastion** ends Stage 02 wave 10 with 100 HP and six durable plates at
Intermediate. It resists 50% of freezing strength and can be grappled.

**Nexus** ends Stage 03 wave 12 with 160 HP and three durable plates at
Intermediate. It resists 65% of freezing strength. At half HP, Overdrive
increases movement by 22% and rotation to 1.15 without restoring HP or plates.
Its score gains the second-phase arrangement.

Both receive **three seconds of protection against grapple recapture after
release**. Normal enemy capture rules remain unchanged. Boss escape defeats
the core; boss health and phases use the shared HUD.

## Original 20-wave Challenge and Titan

The original Challenge remains available from the campaign map and Options,
or directly with `?mode=challenge`. New map generates a new seeded procedural
route; retry preserves it. Exploration-based unlocks and the original record
`arc_defense_v1_best` remain separate from campaign progress.

Titan arrives after the last enemies of wave 20. At half HP its six plates
spread and movement/rotation accelerate. It resists 78% of freezing strength,
cannot be grappled, and ignores speed boosts. Existing music/effects volume,
mute and pause controls apply.

**Options → Boss Test** restores a Challenge map with 3,500 energy and all
technologies. Build, then Release Boss. Load sample defense uses the normal
tower prices and upgrade costs. Retry Boss and Return to Campaign preserve
mode semantics. Boss Test never changes campaign or Challenge records.

## Verification

From the repository root:

```sh
node arc-defense/tests/engine-regressions.cjs
node arc-defense/tests/stage-one-simulation.cjs
node arc-defense/tests/stage-two-simulation.cjs
node arc-defense/tests/stage-three-simulation.cjs
node arc-defense/tests/stage-four-simulation.cjs
```

Regressions cover movement/escapes, boomerangs, E-Link construction and damage,
all stage gates/records/routes, boss phases and grapple recovery, Magnetar
levels/timing/protection/cancellation, and safe boss-particle rendering.

Real combat simulations use legal purchases and earned energy. The Stage 04
check first isolates bound targets against all seven other tower families,
then runs twelve complete waves. Its sample completes 50 Magnetar pairs and
finishes at 20 core, 428 kills and 743 energy. The earlier Stage 01/02/03
baselines remain 12/15/20 core. These are reproducible sample strategies,
not guarantees for other builds or difficulties.
