# ARC DEFENSE

Standalone HTML/JavaScript tower defense. Current version: **9.22**.

Play: https://tigreoslam23.github.io/Jeux/arc-defense/

## Titan

Titan arrives after the last enemies of wave 20. Destroy the boss to finish
Stage 01. At half health, its six armor plates spread apart and its rotation
and movement accelerate. The encounter has an original synthesized score,
an arrival cue, a denser second-phase arrangement and a defeat explosion.
Existing music/effects volume, mute and pause controls apply.

## Boss Test

Open **Options → Boss Test**. The same map resets with 3,500 energy and all
tower technologies unlocked. Build freely, then select **Release Boss**.
**Options → Load sample defense** provides a starting layout for 3,125 energy.
**Retry Boss** restores the test on the same map; **Return to Campaign**
starts a normal campaign. Boss Test never changes campaign records.

Titan resists 78% of freezing strength, cannot be grappled, and does not use
speed boosts. Tunnel protection and the ordinary tower damage rules apply.

## Checks

Run `node arc-defense/tests/engine-regressions.cjs` from the repository root.
The suite covers escapes, boomerangs, E-Link construction/combat, campaign
results, Titan arrival/phases/armor, Boss Test isolation and music scheduling.
