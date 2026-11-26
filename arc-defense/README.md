# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.64.1**.

Play / install: https://tigreoslam23.github.io/Jeux/arc-defense/

## Circular tap and focus feedback (9.64.1)

Tower and upgrade buttons use circular glows for touch, selection and keyboard focus.

## Circular tower controls (9.64.0)

Tower selection and action buttons are circular, with a color shared by the selected tower type, its upgrade panel and the targeting and specialization actions. The dock backgrounds are transparent. The two-step E-Link placement uses the same circular controls.

## Border construction, surge waves and full armor (9.63.9)

The build grid spans 18 × 11 cells. Both campaigns and all ten Free Play circuits leave room between the lanes and the edge where the geometry allows. Construction checks the continuous path, skips teleport gaps and still leaves clearance around the actual portal mouths.

One wave in each campaign stage is a surge with double the enemies and closer spawn spacing. Challenge uses wave 10 of 20. Every enemy starts with all its armor segments (four for Orbs, three for Trions, six for Hexions), including Violet offspring. Stage 01's introductory waves space out their arrivals to give a starter defense time to break the additional plates.

## First Contact shortcuts (9.63.8)

Stage 01 introduces a short red Link. Stage 02 keeps its three-second crossing between the first two vertical lanes. Stages 03–05 alternate between two downstream shortcuts, one available per opening. The longer routes can bypass more of a defense, but admission is capped at five enemies per opening and each enemy can use at most one shortcut. Stages 03–04 open for four seconds, and Stage 05 opens for three. The forty-second cooldown begins when the Link closes.

## Stage terrain refinements (9.63.7)

Stage 02's red Route Link crosses between the first two vertical lanes in the portrait view. It admits up to five enemies during a three-second opening, followed by the usual forty-second cooldown. Stage 09 and Free Play's fourth circuit separate the two nearest black-hole mouths so their halos no longer overlap.

## Route Link (9.63.6)

The red arc connects two points on the same uninterrupted section of the route. It opens when the first enemy reaches the entry, stays open for five seconds of active play, and reopens after a forty-second cooldown. Up to five enemies can enter per opening. Each enemy may enter once per circuit and rejoins the route farther ahead toward the core at 150% of its normal speed. Towers cannot target, damage, slow or displace enemies on the arc. Enemies already on the link finish crossing after it closes.

## Maw returns (9.63.4)

Maw replaces Hole. The 220-energy tower swallows one enemy at a time.
Each level multiplies absorption and digestion speed by 1.30, so the time
from capture to elimination is 6.80, 5.23, 4.02, 3.09 or 2.38 seconds.
Bosses use the old crush-and-release behavior and lose 12% of maximum HP.

## Magnetar armor stripping (9.63.2)

Magnetar strips armor after one second and recharges for two seconds. Levels
1–5 bind up to two to six armored targets respectively. The two outer lobes
form an infinity at level 1. A continuous animated strand crosses between
consecutive targets and bends around each one, adding an inner loop per extra target.
Each loop strips its target’s plates without reducing HP.

## Scout and Grapple targeting (9.63.1)

The Scout shows the route in the opening preview and returns at 0.35 cells
per second. Its live trail counts toward exploration, alongside monster
passages. Towers and enemy effects ignore the Scout. It bursts when the
route is fully explored by the monsters or when it reaches the exit.
Precision, Rapid and Ricochet use the actual location of grappled enemies.

## Body armor across all modes (9.63.0)

Orbs, Trions and Hexions now share the trial armor rules in Campaign,
Challenge and Free Play. Their bodies have four, three and six curved
sides respectively. Gray armor shields the sides selected by each wave;
exposed sides take damage and the core collapses when body HP reaches zero.
Bosses keep their own armor and weak points. The short Trion trial remains
available from the menu.

## Trion arc armor trial (9.62.11)

Open [the trial](https://tigreoslam23.github.io/Jeux/arc-defense/?trion-armor=arcs)
or choose **Try Trion arc armor** from the campaign overview or the Options
menu. The trial opens directly to a single wave of eight blue Trions with
three intact arcs each. Place towers, then choose **Release Trions**. Trial
results leave campaign and Free Play records alone. A solid blue star and
a small white center remain visible throughout the fight. Three rotating gray
arcs shield its boundary. When an arc breaks, that side of the blue body is
exposed to direct damage. The white center shrinks as the body loses health
and collapses before bursting when the body reaches zero HP.
Armor arcs retain the previous one-hit durability. The Boomerang can break
one arc per pass and keeps flying. E-Link and area damage retain their
existing effects.

## Color restricted to the inner surface (9.62.6)

Regular Orbs, Trions and Hexions now have light-gray inner arcs and armor.
Only the curvilinear area enclosed by the inner arcs is filled with the family
color at 45% opacity. The painter joins the existing sampled inner-arc geometry
into a closed path: it does not draw or fill a circular disc. The crescent gaps
between inner arcs and outer armor remain empty.

Family color remains visible after armor is lost. The protected core keeps
its family color; loss of the last plate changes it to white (red for White
units). Core shrinking and subtle low-health flicker are retained. Hole
captives and smaller offspring use their real inner geometry; bosses keep
their existing design. The field guide describes the new visual roles.

Visual-only release: collision, damage, armor, family abilities, boosts, waves
and saved progress are unchanged. Scripts compile; actual engine initialization
and mocked-canvas rendering cover all three shapes, eight families, armor
states, health states and Hole captives. Interior fill paths are checked against
the inner-arc samples, with no circular fill or combat-state mutation.

## Monochrome units with armor-state cores (9.62.5)

Regular Orbs, Trions and Hexions have no disc fill. Inner arcs, remaining armor
plates and the protected core all share one family color. When the last actual
plate disappears, the core becomes white. White-family units instead switch
to a red core, preserving an unmistakable change. A partially armored unit
retains its colored core. Actual plate flags, not a potentially stale counter,
determine the presentation; existing armor is never mutated by rendering.

The shrinking core and subtle low-health flicker remain independent health
cues. Fission offspring now hatch fully armored, with a white
core. Magnetar armor stripping changes the core on release. Hole captives use
the same rule. Boss artwork and health bars keep their existing behavior.
The field guide explains the new color rule.

Visual-only release: armor removal, hitboxes, damage, abilities, movement,
boosts, waves and saved progress are unchanged. All scripts compile; actual
engine initialization and mocked-canvas rendering cover the three shapes,
eight families, full/partial/absent armor and multiple health states. Core
colors and the last-plate threshold were checked without state mutation.

## Family-colored translucent bodies (9.62.4)

Returns regular Orbs, Trions and Hexions to family-colored armor and red inner
weak arcs, with their existing shrinking red health core. A flat 28%-opacity
disc in the same family color now fills the entire interior behind the lines.
There is no additional outline, health ring, badge or decorative halo.

The fill remains when armor is stripped, so family identity is still readable.
Fission offspring scale the disc with their smaller geometry. Hole captives
keep the same body fill throughout suction, multiplied by their existing fade.
Boss presentation and dedicated health bars are unchanged. The field guide
describes the restored red vulnerable arcs and colored body.

Presentation only: collision geometry, damage, armor, family abilities, boosts,
waves, routes and saved progress are unchanged. Inline and PWA scripts compile.
The actual engine initializes and renders all three shapes, eight families,
three health states and Hole captives with a mocked canvas. Fill opacity,
radius scaling, boss exclusion and unchanged combat functions were checked.

## Colored interiors and neutral armor (9.62.3)

Regular Orbs, Trions and Hexions now use one uniform family color for their
inner arcs, silver-gray (#b9c2cf) for all remaining armor plates, and red only
for their central health core. The color identity remains visible after armor
is stripped. Standard units use their original cyan as the inner color.

Hole captives use the same palette. Arc-hit highlights follow the family color
and use a lighter flash; armor-impact particles use neutral gray. The field
guide and help text explain the new color roles. Boss designs are retained.

The shrinking health core and absence of health/family rings are preserved.
This changes rendering only: collision geometry, armor removal, damage,
family abilities, boosts, waves, routes, and existing progress are untouched.
Validation: inline and PWA script compilation, actual engine initialization
and mocked-canvas rendering of all three shapes in every family and health
state; collision and combat functions compared unchanged with 9.62.2.

## Quieter enemy silhouettes (9.62.2)

Ordinary Orbs, Trions and Hexions now show remaining health through the red
core alone: its visible radius falls smoothly from 4.5 to 1.8 pixels as HP falls.
Below 25% HP, opacity gently varies between 76% and 100% using simulation time,
so the cue stops while paused. Regeneration naturally enlarges the core again.
Smaller fission offspring use the same proportion at their existing scale.

Removed the circular health gauge, segmented family coat, family badge,
Fury ring, and redundant Freezer / Grapple halos. Armor colors still identify
families; their abilities and red weak arcs remain intact. Active tower links,
physical capture effects and dedicated boss bars retain their functional cues.
Hole captives use the same health core and family armor color.

This is a presentation change: the actual hittable core, armor geometry,
damage, enemy profiles, movement, boosts and campaign progress are unchanged.
The field guide describes the new presentation. All inline scripts compile;
core size, opacity bounds, boss behavior and unchanged collision/combat
functions were checked. The existing evolution render check uses the new core
painter.

## Chromatic enemies and timed boosts (9.62.1)

Shape still determines the Orb / Trion / Hexion category. A colored coat,
matching armor color and a distinct symbol identify one independent ability.
Vulnerable inner arcs and the core remain red. Bosses and established elite
anchors retain their authored profiles. The original Challenge remains classic.

| Color | Ability |
| --- | --- |
| White | 20% faster, 22% less health |
| Blue | 40% less E-Link damage; other damage unchanged |
| Orange | 30% more health, 12% slower, 45% less Repulsor recoil |
| Green | Regenerates 2.5% max HP/s after 3 damage-free seconds; armor never regrows |
| Red | 30% faster while below half health |
| Yellow | Every boost lasts 60% longer |
| Violet | Releases two fragile, armored, smaller same-shape offspring on death |

Fission offspring carry no energy reward and cannot divide again. They must be
cleared before victory, count once as kills, and cannot appear across a portal.
Hole consumes the entire violet unit without fission. Captured units remain
protected from other damage, and regeneration cannot exploit Magnetar, Hole or
tunnels. Green regeneration is capped and cannot resurrect dead units.

Family introduction: White at Stage 01 wave 4; Blue and Orange at Stage 02;
Green at Stage 03; Red at Stage 04; Yellow at Stage 05; Violet at Stage 06.
Later stages combine colors in short groups independently of their shape mix.
Wave announcements list the upcoming colors. Free Play maps 1–4 have uniform
color convoys; maps 5–10 mix families. Prism Blossom (8) and Aurora Corkscrew
(10) include all seven. Existing routes, warp locations, primary wave counts,
boss encounters, budgets, unlocks and prior progress remain intact.

| Pad | Multiplier | Duration | Cycle |
| --- | --- | --- | --- |
| Yellow Classic | 2.5x | 1.1 s campaign / 0.8 s Free Play | Always on |
| Orange Pulse | 2.5x | 1.1 s | 10 s on / 10 s off |
| Red Hyper | 3.75x | 0.75 s | Always on |
| Ringed Red Hyper Pulse | 3.75x | 0.75 s | 10 s on / 10 s off |

Campaign introduction: Yellow Stage 03, Orange Stage 04, Red Stage 05,
intermittent hyperboost Stage 08. Free Play exposes more variants immediately.
Some pads are synchronized, others have opposite 10-second offsets. Dark
chevrons indicate inactive pads; a countdown ring shows the switch time.
Simulation time drives their state and pauses with the run. Phase carries
between waves, and resets on replay. Movement splits at exact crossings and
boost expiry, preserving duration and distance at 1x / 4x. Effects refresh,
never multiply on top of one another. Titan keeps its original boost immunity. The classic Challenge keeps its original 1.8-second yellow boosts.

Open **Field guide · Colors & boosts** in the campaign menu or Options for all
abilities and counters. Circuit cards list their families before launch.
The PWA release, shell and progress module are updated together. Older backup
records remain valid; new Free Play records include bounded offspring counts.

Validation: 24 new evolution checks, 18 Hole checks, 19 Repulsor checks,
13 Free Play checks, 94 engine regressions, 12 PWA checks and the campaign
picker check. Browser QA verified the guide, seven-color live convoys, timed
active/inactive pads, persistent route reveal, pause and 4x play. Full campaign
balance still benefits from player feedback after these new combinations.

## Hole replaces Hook (9.61.1)

Hole costs **900 energy**. A telescopic arm plants a mine on a reachable section
of the real route. Deployment takes 0.75 seconds, followed by a 2.4-second fuse
with accelerating light and sound pulses. Detonation tears a dark vortex into
the path: nearby enemies upstream, downstream or on another nearby branch
spiral inward, shrink, and are completely destroyed.

| Level | Suction time | Radius (cells) | Arm reach (cells) |
| --- | --- | --- | --- |
| 1 | 2.00 s | 1.65 | 3.2 |
| 2 | 2.40 s | 1.85 | 3.4 |
| 3 | 2.88 s | 2.05 | 3.6 |
| 4 | 3.46 s | 2.25 | 3.8 |
| 5 | 4.15 s | 2.45 | 4.0 |

Suction time follows 2 × 1.2^(level−1). Recharge is **28 seconds** starting
at deployment, with one mine per tower. Upgrade base costs are 400 / 650 / 900 /
1200 energy (campaign upgrade modifiers still apply). Existing level-five Range
and Reset specializations apply to the new tower.

The vortex ignores armor and is lethal to bosses too. Magnetar-held enemies
remain protected; captured enemies cannot be hit by other towers. Captures
finish their animation even after suction ends. Portal jumps cannot cause a
false capture across the board. Mines avoid portal mouths and tunnels.
Selling cancels unexploded mines, while a vortex already open finishes normally.
Upgrades do not alter a mine already deployed.

The legacy internal technology slot `maw` preserves existing unlocks. All
tower-facing labels, prices, previews and action panels now show Hole.
Other tower balance, authored waves, campaign routes and ten Free Play circuits
are unchanged. Installed apps receive this release through the existing update
panel.

Validation: 18 Hole checks, 13 Free Play checks, 19 Repulsor checks,
94 engine regression checks, the campaign picker check and 12 PWA checks pass.
Browser play verified a planted mine, visible vortex, enemy elimination rewards
and paused cooldown. Historical Hook/Maw/Echo test entry points now run Hole
coverage.

## Installable offline app, safe updates and progress transfer (9.60.1)

The existing game URL now serves a PWA, with a scoped manifest, 192/512 PNG icons,
a maskable icon and Apple home-screen metadata. The game remains available in
the browser and all campaigns, circuits, balance and saved progress are retained.

Use **Install / Updates** in the campaign menu or **App · Install, updates &
backups** in Options. A supported browser installation prompt is used when
available; otherwise the panel explains browser-menu installation and Safari's
Share → Add to Home Screen flow. Installation remains a user action on their
device. The browser QA did not install an OS app.

The service worker downloads a complete release (HTML, two JavaScript modules,
manifest and three icons) before confirming offline readiness. Navigation uses
that consistent cached release, including game query parameters. Only this
game's directory is controlled, and cleanup deletes only this game's old caches.
Offline play requires the initial successful online download. Music is already
synthesized locally by the game. Browser/OS storage eviction can require a fresh
download; backup files are recommended for device transfers.

Updated workers wait. New versions are checked on opening/returning online,
returning to the app and every five minutes, or manually. The app offers Update
now at the menu or queues an update after the run. Prepared defenses and
between-wave countdowns count as active runs. Activation asks every open game
window for permission; an active or unresponsive tab blocks it. Safe windows
briefly lock new launches while activation completes. No active defense is
automatically reloaded.

**Release maintenance:** every code/content release must update the VERSION
constant in sw.js (and keep the displayed pwa.js / HTML version consistent).
The worker is registered with updateViaCache:none. A failed new download leaves
the active cached version intact. Do not remove old-save keys during updates.

Export progress downloads a schema-versioned JSON file containing completed
campaign stages, unlocked technologies, ten circuit records, Challenge best
result and supported audio/graphics/theme settings. Active runs are not saved.
Import validates file size (512 KB), app/schema, an explicit key allowlist and
value ranges, then shows a review before merging and reloading. Merging unions
unlocks/clears and retains better existing scores. Storage write errors attempt
rollback. Import is disabled during an active/prepared defense. Browser and
installed-app storage can differ on iOS; export before switching and import in
the installed app. No server account or automatic cross-device sync is added.

Validation: 12 PWA checks cover progress round-trips, malicious/invalid input,
merge rules, failed-write rollback, atomic offline downloads, offline navigation,
worker scope, cache cleanup and coordinated update activation. Existing 13 Free
Play, 22 Hook, 19 Repulsor, 94 engine and campaign picker checks pass. Browser QA
confirmed offline readiness, a real cached-release update from 9.60 to 9.60.1,
blocking with other tabs open, backup export/import review and successful merge
with five stage clears and ten stars preserved.

```sh
node arc-defense/tests/pwa.cjs
node arc-defense/tests/free-play.cjs
node arc-defense/tests/hook.cjs
node arc-defense/tests/pusher.cjs
node arc-defense/tests/engine-regressions.cjs
node arc-defense/tests/campaign-picker.cjs
```

## Free Play Volume 02 — Loop Worlds (9.51)

Five additional open circuits extend Free Play to ten maps. The first five
circuits, campaign terrain, tower balance, authored waves and save keys are
preserved. All ten map buttons, records, identifiers and menu counts now work.
Volume 02 is grouped below the original five with portrait previews.

| ID | Circuit | Geometry | Enemies | Boosts | Budget |
| --- | --- | --- | ---: | ---: | ---: |
| 06 | Solar Coil | Two golden spirals linked by a black-hole pair | 600 Orbs | 8 | 2500 |
| 07 | Infinity Rush | A large figure eight traversed for three lobes | 720 Trions | 9 | 2700 |
| 08 | Prism Blossom | Four rose-curve petals, black hole, outer border lap | 840 mixed | 10 | 2900 |
| 09 | Orbital Cascade | Four complete elliptical orbits, three black-hole pairs | 900 Hexions | 10 | 3100 |
| 10 | Aurora Corkscrew | Five continuous rolling loops | 1000 mixed | 14 | 3400 |

New paths use parametric spirals, a Gerono figure eight, a four-petal rose,
ellipses and a drifting trochoid. Physical samples remain <=9 pixels apart.
Dense, already smooth samples bypass redundant corner rounding; sparse corners
still use the original rounding pipeline. Build reservation and combat use the
same sampled route, including its real teleport discontinuities. Intersections
do not change an enemy's assigned progress.

Each new map has bespoke decorative effects: rotating solar corona arcs,
twin reactor halos, a rotating petal core, orbital satellites, or translucent
aurora ribbons. Two light packets in Eco / four otherwise follow the route
without drawing through portals. These effects use elapsed simulation time,
obey pause and speed, remain bounded in count and never modify combat state.
The full circuit stays visible after its initial reveal as in other Free Play
maps. Prices and boost multipliers retain their existing rules.

Validation: 13 Free Play checks now exercise all ten circuit builds and complete
spawn/end/save lifecycles, actual construction space, advertised boost counts,
continuous turning, valid menu identifiers, nonmutating effects, pause and
regular spawning at 1x/4x. The existing 22 Hook, 19 Repulsor, 94 engine regression
and campaign picker checks also pass. Solar Coil, Prism Blossom and Aurora
Corkscrew were inspected in the browser.

## Free Play — Take the wild route (9.50)

The campaign picker now includes five freely accessible exotic circuits, with
portrait SVG route previews, their own colors, all ten technologies available,
and independent device records. Each circuit has one continuous stream instead
of small grouped waves. The initial path sweep permanently lights the whole
route, direction markers, start/finish strips and every turbo pad. A faint route
preview is available during construction.

| Circuit | Enemies | Regular spawn interval | Start budget | Boosts | Transfers |
| --- | ---: | ---: | ---: | ---: | --- |
| Neon Grand Prix | 320 Orbs | 0.42 s | 1800 | 10 | None |
| Ribbon Riot | 420 Trions | 0.38 s | 2000 | 5 | None |
| Warp Boulevard | 480 Orbs | 0.34 s | 2200 | 6 | Two opposite-edge warps |
| Event Horizon | 540 Hexions | 0.42 s | 2400 | 5 | Three black-hole pairs |
| Hyperdrive | 800, blocks of 80 per type | 0.25 s | 2800 | 12 | Two warps and two black-hole pairs |

The wall-hugging Grand Prix folds into inner chicanes; Ribbon Riot uses repeated
hairpins; Warp Boulevard crosses the arena frame twice; Event Horizon links four
rounded circuits through gravitational wells; Hyperdrive combines border runs,
overlapping loops, boosts and four transfers. Every physical segment is sampled
at <=9 pixels and real teleport discontinuities use a 0.01 route-distance step,
so reservation, collision, E-Link and Hook never connect teleport endpoints.

Free Play preserves ordinary tower prices, upgrades, the 20-life core, armor and
combat rules. Enemy speed has no cadence jitter, and subframe spawn age preserves
regular spacing at accelerated game speed. Enemy release, pause, live counters,
retries and end dialogs use the existing loop; no Titan is queued for a circuit.
Rewards are 3 energy per enemy. Free Play turbo lasts 0.8 s at the existing 2.5x
boost factor. Records use separate arc_free_v1_<id> keys and do not grant campaign
stars or overwrite technology unlocks. All five circuits are always open.

## More winding campaign terrain

All ten campaign routes now use authored rounded turns, including border runs
and hairpins. Existing authored enemy waves, boss HP, stage budgets and saves
remain. Terrain mechanics are introduced progressively:

| Stage | Boost pads | Portal terrain |
| --- | ---: | --- |
| 01–02 | 0 | None |
| 03 | 1 | None |
| 04 | 2 | None |
| 05 | 2 | One opposite-edge warp |
| 06 | 3 | None; hairpins |
| 07 | 3 | One black-hole pair |
| 08 | 4 | Two opposite-edge warps |
| 09 | 4 | Two black-hole pairs |
| 10 | 5 | Two warps and two black-hole pairs |

Campaign boosts last 1.1 s, use the existing speed factor and are spaced away
from portal mouths. Bosses keep their existing immunity to boost pads. Campaign
path discovery remains the normal exploration mechanic; only Free Play keeps
the full revealed route visible.

Validation: ten Free Play integration checks cover real build geometry,
construction space, exact advertised quantities, spawn schedules and physical
spacing at 1x/4x, pause, permanent revelation, separate saves, five complete stream
lifecycles, and progressive campaign terrain. Existing 22 Hook checks, 19
Repulsor checks, 94 engine regressions and campaign picker checks pass.
The Free Play picker, Grand Prix, Warp Boulevard, Event Horizon and Hyperdrive
were inspected in the running browser.

```sh
node arc-defense/tests/free-play.cjs
node arc-defense/tests/hook.cjs
node arc-defense/tests/pusher.cjs
node arc-defense/tests/engine-regressions.cjs
node arc-defense/tests/campaign-picker.cjs
```

## Hook replaces Echo (9.45)

Hook costs **220 energy** and captures one enemy with a retractable copper arm.
It pivots exactly **180 degrees in three seconds**, retracting then extending,
and releases the enemy on an earlier, opposite portion of the actual route.
A valid upstream landing point is required before capture; tunnels, portal
crossings and downstream landings are excluded. The placement/selection guide
shows a possible transfer. Positioning between two portions of path is essential.

The captive is protected from every other tower, including shots already in
flight. Hook alone removes a percentage of maximum HP each second. Damage,
destination and recovery are snapshotted when capture starts.

| Level | Capture range, cells | Return reach, cells | HP loss/s | Three-second loss | Recovery after release |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 2.6 | 3.0 | 10% | 30% | 8 s |
| 2 | 2.9 | 3.4 | 11% | 33% | 7.5 s |
| 3 | 3.2 | 3.8 | 12% | 36% | 7 s |
| 4 | 3.5 | 4.2 | 13% | 39% | 6.5 s |
| 5 | 3.8 | 4.6 | 14% | 42% | 6 s |

Upgrade base prices remain 120/170/235/310. Range specialization extends both
reaches by 22%; Reset shortens recovery by 18%. Bosses use the same HP percentage,
with an eight-second recapture guard; ordinary enemies have a four-second guard.
Selling cancels a transfer at its original route position, retaining only damage
already dealt. Pause, speed, kills and rewards follow the normal game loop.
The internal technology alias `maw` preserves saved unlocks. No Hook build cap.
Repulsor, authored waves, campaign results and existing technology saves are retained.

Verification: 22 Hook checks, 19 Repulsor checks, 94 engine regressions and campaign
picker checks. Legacy Echo/Maw test commands forward to Hook.

```sh
node arc-defense/tests/hook.cjs
node arc-defense/tests/pusher.cjs
node arc-defense/tests/engine-regressions.cjs
node arc-defense/tests/campaign-picker.cjs
```

## Historical: Echo replaces Maw (9.44)

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


