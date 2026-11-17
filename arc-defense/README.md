# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.44**.

Play: https://tigreoslam23.github.io/Jeux/arc-defense/


## Echo replaces Maw (9.44)

Echo replaces the digestion tower in the existing ninth dock slot for **220
energy**. The internal type/unlock `maw` is retained to preserve old campaign
technology data; all player-facing labels, icons, controls and descriptions use
Echo. The old capture, shrink, grinding, immunity and boss-crush behavior is
removed. Existing stage clears, stars, Repulsor values and authored waves remain.

Echo marks one eligible enemy in range, then copies **30% of its actual HP loss
to each of the two nearest eligible neighbors** within the resonance radius.
The source remains moving, damageable, freezable, grappleable and eligible for
Magnetar/Repulsor. Echo causes no damage on its own. First/Near/Strong priorities
select the source. Two Echo towers cannot mark the same source at once.

| Level | Marking range, cells | Mark duration | Neighbor radius, cells | Recharge | Base upgrade cost |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 2.8 | 4 s | 2.0 | 6 s | — |
| 2 | 3.0 | 4.5 s | 2.2 | 6 s | 120 |
| 3 | 3.2 | 5 s | 2.4 | 6 s | 170 |
| 4 | 3.4 | 5.5 s | 2.6 | 6 s | 235 |
| 5 | 3.6 | 6 s | 2.8 | 6 s | 310 |

Recharge starts on marking; one mark per tower is active at a time. Mark duration,
radius and fraction are snapshotted at application. Existing upgrade multipliers
apply. Range specialization extends marking range by 22%; Reset reduces the
marking cooldown by 18%. The copy fraction stays 30% and neighbor capacity stays
two at every level. No-neighbor situations consume the mark normally.

Only HP actually lost is echoed, including the normal heart-hit multiplier.
Armor-only hits trigger no echo. Overkill is capped to remaining source HP.
A lethal direct hit can echo before the source is removed. Copied damage goes
directly to neighbor HP and does not remove their armor. Bosses can be sources
and neighbors with the same 30% HP-loss rule; no fixed boss-health percentage is
removed. Dead, escaped, tunnel-covered or magnetically protected neighbors are
excluded. A protected source does not echo while protection is active.

Every source's direct damage is collected before any copies are applied.
Baselines then reset after copied damage, so echoes cannot recursively trigger
other echoes in the same or following frames. All damage families, including
E-Link and projectiles, feed this shared frame-end accounting. Standard boss
phases, kills, rewards and victory handling process any resulting deaths once.

The tower uses nested pink diamonds; marked enemies have pink resonance brackets
and a duration bar. Pink dashed flashes with travelling diamonds show damage
copies. Visual effects are capped and throttled. Selling cancels the mark; retry,
stage changes and wave reset clear marks. All timers obey pause and game speed.

Verification: 21 Echo checks, 19 Repulsor checks, 94 engine regressions and campaign
navigation checks pass with real Node. The selected actions panel and active mark
were inspected in the running desktop browser. The legacy `maw.cjs` test entry
point forwards to `echo.cjs`; historical Maw mechanics below describe earlier
versions.

```sh
node arc-defense/tests/echo.cjs
node arc-defense/tests/pusher.cjs
node arc-defense/tests/engine-regressions.cjs
node arc-defense/tests/campaign-picker.cjs
```

## Repulsor — Wi-Fi arcs and five-second recharge (9.43)

Repulsor now has a **five-second recharge at every level**, including Force
specialization. Its existing five-target capacity, doubled recoil distances,
price, two-tower construction cap, target priority and repeat guards remain.

Three open white arcs replace the full circular pressure fronts. The emitter
icon also uses a Wi-Fi silhouette and turns toward the primary target. Nearby
target bearings share an arc fan; groups in different directions get separate
fans so all five reserved targets stay visually covered without narrowing the
existing targeting behavior. Each fan spans 120 degrees. Recoil trails keep
their backward chevrons and no longer draw an enclosing target ring.

Nineteen Repulsor checks now verify the uniform five-second recharge, open
arc geometry, all five targets, and the existing recoil/cancellation rules.
All 94 engine regressions, 19 Maw checks and campaign navigation checks pass.
The new arcs and five-second displayed recharge were inspected in the desktop
browser. Maw remains available while a replacement concept is being discussed.
Historical values below describe their named versions.

## Repulsor — five-target pressure waves (9.42)

Repulsor now emits three expanding white pressure fronts instead of a guided
projectile. Each activation reserves **up to five eligible enemies** in range,
using First/Near/Strong priority. The leading front pushes each reserved target
once when it reaches it; trailing fronts are visual echoes. A sixth enemy is
not substituted if a reserved enemy dies, escapes, becomes protected or leaves
the wave radius. Two Repulsors reserve separate groups.

Recoil distance is **twice the 9.40/9.41 distance at every level**:

| Level | Targets | Recoil in normal walking seconds | Recharge |
| --- | ---: | ---: | ---: |
| 1 | Up to 5 | 4 | 16 s |
| 2 | Up to 5 | 4.5 | 15 s |
| 3 | Up to 5 | 5 | 14 s |
| 4 | Up to 5 | 5.5 | 13 s |
| 5 | Up to 5 | 6 | 12 s |

The longer recoil lasts 0.75 simulation seconds and has a brighter path trail
and backward chevrons. Three concentric fronts remain visible for 1.35 s.
Bosses retain 30% recoil strength and an eight-second repeat guard; ordinary
enemies have a six-second guard after recoil. Cost remains 180 energy and the
construction cap remains two. Enemies remain damageable while rewinding.
Wave and recoil timers obey pause and game speed, with level snapshots at launch.

Seventeen real-Node Repulsor wave checks, 19 Maw checks, 94 engine regressions
and campaign navigation checks pass. The white wave fronts were also inspected
in the running desktop browser. Phone-specific visual verification was not run.
Historical single-target values below describe versions 9.40/9.41.

## Repulsor name (9.41)

The white recoil tower is now named Repulsor in its dock button, tower actions,
construction feedback, help text and accessibility labels. The existing `pusher`
internal ID, two-tower cap and combat values are retained.

## Repulsor — white single-target recoil (9.40)

Repulsor is a tenth family, available immediately in campaigns and Challenge,
for **180 energy**, with **at most two active towers** on the board. Both tap
placement and drag/drop enforce the limit. The dock shows 0/2, 1/2 or 2/2,
disables construction at two, and reopens a slot after selling one (108 refund).
Existing records and authored stage profiles are preserved.

One white guided projectile reserves one eligible enemy. On impact it pushes
that enemy backwards along the actual curved route over 0.42 simulation seconds.
The enemy stays vulnerable to damaging towers and Freezer during recoil.
Grapple, Magnetar and Maw wait until the shot/recoil ownership ends. There is
no direct damage or armor removal. Other Repulsor projectiles select another
available enemy. A missing, dead, protected or tunnel-covered target cancels
the shot, clears its reservation and retains the shot's cooldown.

| Level | Range, cells | Recharge | Recoil in seconds of normal walking | Base upgrade cost |
| --- | ---: | ---: | ---: | ---: |
| 1 | 2.8 | 10 s | 2 | — |
| 2 | 3.0 | 9.5 s | 2.25 | 100 |
| 3 | 3.2 | 9 s | 2.5 | 145 |
| 4 | 3.4 | 8.5 s | 2.75 | 200 |
| 5 | 3.6 | 8 s | 3 | 275 |

Existing campaign upgrade multipliers apply. Range specialization adds 22%
range; Force adds 20% recoil distance and keeps the eight-second recharge.
A projectile retains its firing level snapshot. Recoil distance uses the
enemy's normal movement speed before freeze/boost, with **30% strength against
bosses and minibosses**. A pushed enemy resists another push for four seconds
after recoil (six seconds for bosses). No enemy moves before the entrance,
backwards across a portal or into a tunnel. Reversing does not grant additional
exploration visits. All motion, shots, cooldowns and guards use simulation time.

The white cannon has twin chevrons and a charge bar; its projectile and route
trail distinguish the impulse from freezing. On phones, ten buttons use two
rows of five with 44px targets; the board keeps its uniform aspect ratio and
accounts for the taller dock. The existing selected panel fills that dock.

Checks: `node arc-defense/tests/pusher.cjs` covers legal construction/sale limits,
one-target shots, separate reservations, curved recoil, vulnerable targets,
boss resistance, cancellation, tunnels/portals, pause/speed, upgrade snapshots,
exploration and rendering. Sixteen Repulsor checks, 19 Maw checks, 94 engine
regressions and campaign navigation pass in the JavaScript authoring harness.
Browser/mobile visual verification is unavailable in this environment.

## Maw — clearer grinding animation (9.39)

The captive now remains much larger and fully opaque in the chamber after
absorption. Opposed toothed plates repeatedly press against it; the silhouette
widens and flattens with each stroke, with small impact shakes and exposed
counter-rotating gears. Ordinary shell segments disappear visually as digestion
progresses, with short debris streaks and a final fragment burst. Boss armor
remains drawn. A portrait-aligned GRINDING label identifies the active phase.

All animation follows capture age in simulation time and freezes during pause.
Rendering does not change armor, HP, cooldowns or target ownership, nor allocate
additional particles. The final debris reuses the existing completion burst.
The Maw suite now includes 19 checks, including squeezing, finite transforms,
frozen animation and repeated rendering without combat-state mutations.
Browser/mobile visual verification remains unavailable in this environment.

## Maw — single-target digestion (9.38)

Maw is a ninth tower, available immediately for prototyping in both campaigns
and Challenge. It costs **220 energy**. Previous saves automatically gain the
base technology without changing stage clears, stars or records.

A coral mechanical jaw absorbs exactly one available enemy over **0.8 seconds**.
The enemy visibly shrinks into its chamber. Its path progress stops and all
other towers, existing projectiles, Magnetars and grapples exclude it while
captured. After digestion, an ordinary enemy is eliminated and the normal kill
and energy reward are awarded once through the shared death lifecycle.

| Level | Range, cells | Digestion | Recovery after release | Base upgrade cost |
| --- | ---: | ---: | ---: | ---: |
| 1 | 2.5 | 6 s | 12 s | — |
| 2 | 2.7 | 5.5 s | 11.5 s | 120 |
| 3 | 2.9 | 5 s | 11 s | 170 |
| 4 | 3.1 | 4.5 s | 10.5 s | 235 |
| 5 | 3.3 | 4 s | 10 s | 310 |

Existing campaign upgrade multipliers apply. Active captures retain their
starting level snapshot. Level-5 Range adds 22% range; Reset reduces recovery
by 18%. Neither increases target capacity or the damage against bosses.

Bosses and mini-bosses are absorbed for 0.8 s, crushed for 2.4 s, then released
at their original path progress after losing **12% maximum HP**. Their armor
is retained. They resist all Maws for eight seconds after release. A lethal
crush uses the existing boss death/phase and campaign completion handling.

Selling a Maw or removing its tower cancels the capture, frees the enemy
without damage, and restores its route position. Bound, grappled, dead,
escaped or tunnel-covered enemies are ineligible. Capture, digestion,
resistance and recovery use simulation time and obey pause and game speed.
First/Near/Strong target priority remains available. The selected title shows
Ready, Absorbing, Digesting, Crushing boss or Recharge with remaining time.
The nine-tower mobile dock preserves the board's scale and aspect ratio.

Checks: `node arc-defense/tests/maw.cjs` exercises the actual game loop,
capture timing, protection, cancellation, level snapshots, boss release,
pause/speed, rewards and renderer execution. The 94 existing engine checks
and campaign-picker checks also pass. Authoring checks were executed in the
available JavaScript harness with mocked DOM/Node adapters; browser/mobile
visual verification was unavailable.

## Full screen on mobile

Use **Full screen** on the campaign map or under **Game options** during play.
The whole document enters fullscreen, so the map, tower controls, and results
remain available. **Exit full screen** returns to the browser without restarting.
The request is made only when the button is pressed. If an embedded browser
rejects it, a message suggests opening the game in Chrome. Fullscreen layout
keeps controls clear of display cutouts.

## Campaign 02 — Rupture (complete in 9.36)

All five stages are freely accessible. Technologies carry over; each stage has
a fresh budget and an independent best result. Secure all five in any order
to complete Rupture, with a separate 15-star total from Campaign 01.

| Stage | Name | Waves | Enemies | Starting energy | Finish |
| --- | --- | ---: | ---: | ---: | --- |
| 06 | Fracture Relay | 12 | 438 | 700 | Six elite Hexions |
| 07 | Copper March | 14 | 550 | 720 | Anvil + two escorts |
| 08 | Prism Convergence | 14 | 605 | 760 | Prism + three escorts |
| 09 | Energy Divide | 15 | 638 | 600 | Eight elite Hexions |
| 10 | Rift Heart | 16 | Up to 729 | 800 | Rift + 14 reinforcements |

Stage 08 splits each wave into three pressure groups. Prism has 280 HP on
Intermediate and reverses rotation while moving 18% faster at half health,
without healing or restoring armor. Stage 09 grants lower kill rewards
(7/11/18 rather than 8/12/20) to make upgrade choices matter. Stage 10's Rift
has 600 HP on Intermediate, two phases, and 8+6 staggered reinforcements.
It shares Titan's tested collision/phase lifecycle with its own health, speed,
colors and HUD. The original Titan keeps its 20% HP reduction (560 HP in
Stage 05 Intermediate). Existing stage profiles and records are preserved.

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

## Titan health reduction (9.35)

Titan core HP is reduced by 20% in every mode and difficulty. Campaign Stage 05
Intermediate: 700 → 560 HP. Challenge / Boss Test: 240/340/440 → 192/272/352 HP.
Armor, movement, resistances, reinforcements and two-phase behavior are unchanged.
Rupture stages remain freely accessible, with existing progress preserved.

## Campaign picker (9.37)

The campaign map opens with two distinct cards: First Contact (cyan/blue) and
Rupture (aubergine/copper). Each shows stages secured out of five, stars out
of 15, and the next uncleared stage or a three-star replay objective. Selecting
a card shows only that campaign's five existing stage buttons. Campaigns / Escape
returns to the overview; Escape from the overview closes it. Hidden groups are
excluded from keyboard focus. Existing scores, stage access, combat and listeners
are preserved, as are fullscreen and Challenge access. Navigation tests run with
`node arc-defense/tests/campaign-picker.cjs`. Mobile visual QA was unavailable
in the 9.37 authoring environment.
