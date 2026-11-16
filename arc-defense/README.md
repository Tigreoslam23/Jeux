# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.34**.

Play: https://tigreoslam23.github.io/Jeux/arc-defense/

## Full screen on mobile

Use **Full screen** on the campaign map or under **Game options** during play.
The whole document enters fullscreen, so the map, tower controls, and results
remain available. **Exit full screen** returns to the browser without restarting.
The request is made only when the button is pressed. If an embedded browser
rejects it, a message suggests opening the game in Chrome. Fullscreen layout
keeps controls clear of display cutouts.

## Campaign 01 — First Contact

The campaign map opens by default. Clear each stage to unlock the next.
All five stages have fixed authored routes: retrying preserves the trajectory,
while towers, run energy, and core integrity reset. Stage 05 ends Campaign 01.

| Stage | Name | Waves | Enemies | Starting energy | Finish |
| --- | --- | ---: | ---: | ---: | --- |
| 01 | The Relay | 8 | 157 | 340 | Three reinforced Hexions |
| 02 | Armor Front | 10 | 231 | 520 | Bastion mini-boss |
| 03 | Swarm Signal | 12 | 417 | 600 | Nexus boss |
| 04 | Crosscurrent | 12 | 428 | 650 | Gemini twin boss |
| 05 | Titan Protocol | 15 | Up to 613 | 700 | Campaign Titan + escorts |

All stages begin with 20 core. Stage 04 has a distinct crossing route and
increasingly armored formations. Its final wave ends with two 32-HP elite
Hexions followed by both Gemini guardians. All earlier formations and
Stage 01–03 wave data remain unchanged.

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

### Stage 04 — Gemini twin guardians

The last two enemies of wave 12 are **Gemini I and II**, distinct teal/violet
six-plate guardians rotating in opposite directions. At Intermediate each
has **220 HP**, **5 HP per plate**, and movement 1.05. Beginner/Advanced apply
0.82/1.18 to HP and plate durability and 0.94/1.06 to movement. The second
arrives 2.2 simulation seconds after the first to separate their silhouettes.
The stage still totals 428 enemies across twelve waves.

Gemini resists **75% of freezing strength** and receives the existing
three-second grapple recovery after release. Magnetar remains fully effective:
it can bind both, remove all their plates, and subtract 55 HP each at
Intermediate. Existing protection and movement rules remain unchanged.

When one guardian dies, the survivor enters **Last Stand**: movement rises
by **35%**, rotation reaches 1.1 in its original direction, and the boss score
gains its second-phase arrangement. HP and destroyed plates are not restored.
Simultaneous destruction avoids this phase. Either guardian escaping defeats
the core. Both must die to complete the stage; the HUD tracks their combined
HP and remaining guardian count, including a partner still arriving.

Previous stage results and campaign unlocks are retained. Retry clears the
encounter and restores the same Crosscurrent route and starting budget.

### Stage 05 — Titan Protocol

Stage 05 unlocks after Stage 04 and closes **Campaign 01: First Contact**.
A new fixed continuous route supports fifteen authored waves, 700 starting
energy, and 20 core. The regular formations total **602 enemies**, with
increasing armor, health and density. Wave 15's vanguard must finish before
Titan's arrival warning.

Campaign Titan has **700 HP at Intermediate** (574 Beginner, 826 Advanced),
six plates with 6 HP each, movement 0.72 and rotation 0.38. It retains Titan's
78% freeze resistance, grapple immunity, geometry and two-phase score.
At half HP, movement rises to 0.98 and rotation to 1.1, and the plates spread
with 4 HP each. No core HP is restored.

Six escort reinforcements arrive near Titan during phase I; four more arrive
in phase II. They appear over time with a violet arrival effect, and their
positions follow the current boss location. This gives Magnetar nearby
partners for its normal quarter-max-HP compression. The ten escorts and
Titan bring a full two-phase run to **613 enemies**. A lethal skip of phase II
can result in fewer reinforcements; spawned enemy counters remain exact.

Queued reinforcements and remaining enemies block victory even after Titan
dies. Titan escaping defeats the core. Retry clears all queued arrivals.
The original Challenge and Boss Test retain their prior Titan profiles and
never receive the campaign escorts.

The Stage 04 victory offers **Next · Stage 05**. Finishing Stage 05 shows
**CAMPAIGN COMPLETE**, saves its own best result, displays campaign stars
out of 15, and marks the campaign map complete. All five stages remain
replayable and their previous records are retained.

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
node arc-defense/tests/stage-five-simulation.cjs
```

Regressions cover movement/escapes, boomerangs, E-Link construction and damage,
all stage gates/records/routes, boss phases and grapple recovery, Magnetar
levels/timing/protection/cancellation, and safe boss-particle rendering.

Real combat simulations use legal purchases and earned energy. The Stage 04
check first isolates bound targets against all seven other tower families,
then runs twelve complete waves. Its sample completes 53 Magnetar pairs, including two that bind both
Gemini guardians, and finishes at 20 core, 428 kills and 481 energy after
upgrading both E-Links to level 4 during the encounter. An additional
actual-loop probe verifies Last Stand after one guardian dies. The earlier Stage 01/02/03
baselines remain 12/15/20 core. These are reproducible sample strategies,
not guarantees for other builds or difficulties.

The Stage 05 actual-loop simulation finishes fifteen waves, both Titan phases
and all ten reinforcements with legal purchases: 20 core, 613 kills and 484
energy. Magnetar completes four pairs involving Titan. It verifies the final
campaign screen and Stage 05 persistence without overwriting prior stage or
Challenge records. This sample strategy is reproducible, not a guarantee
for other builds or difficulty levels.

## Rupture visual preview

Campaign 02 atmosphere can be previewed on existing stages using Arena atmosphere
in Game options, or the campaign map preview button. Aubergine backgrounds, copper
edge haze and amber fissures preserve tower and enemy colors. Stage 06 now launches Campaign 02; later stages are in preparation. The choice persists locally.

## Campaign 02 — Rupture (9.32)

Stage 06, Fracture Relay, unlocks after Titan / Stage 05. It has a new fixed
3640-unit route, 12 authored waves, 438 enemies, 700 starting energy and 20 core.
Every wave has two pressure groups separated by 5.5 seconds. Six 28-HP elite
Hexions conclude the final wave; no Titan or mini-boss spawns in this stage.
Campaign technologies carry over, while energy and towers reset per stage.
Rupture colors apply automatically when starting Stage 06. Earlier campaigns
keep their stars; Campaign 01's total remains out of 15. Stage 06 has its own
saved best result. Stages 08–10 are visibly marked in preparation.

## Stage 07 — Copper March (9.33)

Unlocked after Stage 06, with 720 starting energy and 20 core. Fourteen authored
waves alternate fast formations and heavier armored convoys, with 550 enemies
in total on a fixed 3116-unit route. Anvil replaces one Hexion in the last
formation and has two Hexion escorts. The mini-boss has 240 HP on Intermediate,
six plates with 6 HP each, and accelerates by 40% at half HP without healing.
It retains mini-boss freeze resistance, a 3-second grapple shield after release,
and a fatal escape. Copper armor outline and its own HUD distinguish Anvil.
Stage 07 saves its own stars and leaves all prior stage profiles untouched.
Stages 08–10 remain in preparation.

## Open Rupture access (9.34)

Stages 06 and 07 are freely accessible without defeating Titan or one another.
Starting either carries all campaign technologies. Their victories and best
results persist independently; no earlier stage is marked cleared. Stage 01–05
progression rules and all combat values remain unchanged.
