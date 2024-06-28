# SNIP Asset naming guidelines

## 1. Prefix 's' for Secret SCRT

Use the prefix "s" exclusively for the „secret SCRT“ denomination, represented as "sSCRT". This distinguishes it from standard public SCRT.

## 2. IBC native assets naming

Inter-Blockchain Communication (IBC) native assets are not prefixed with "s". For instance, "OSMO" remains "OSMO" instead of becoming "sOSMO". This is due to the auto-wrapping feature, which ensures their privacy by default.

## 3. Bridged Asset Suffixes

When multiple bridge providers exist for a non cosmos ecosystem bridged asset and are available on Secret Network, attach a three-letter suffix separated by a DOT (.) to specify the source. If there exists multiple sources of a bridged asset in the cosmos ecosystem but only one of them is available on Secret Network, then no suffix will be attached to it. If later on an additional source is supported, the suffix will be added.&#x20;

The suffix is derived by removing vowels and leaving consonants of the source name, of which a maximum of three characters will be used. Small deviations from this are allowed if the bridge would otherwise not be recognizable (for example: Axelar -> .axl).&#x20;

Across the Cosmos Ecosystem some established suffixes are:&#x20;

Noble → .nbl,&#x20;

Axelar → .axl,&#x20;

Wormhole → .wh,

Gravity Bridge → .grv,&#x20;

Composable Finance → .cmp

Kava -> .kv

This does not apply to “canonical” assets, see below.&#x20;

## 4. Canonical Asset Suffixes

Canonical assets from the Cosmos Ecosystem shall not have a suffix in Secret Network. &#x20;

Canonical in this context means that there is native asset provider in the Cosmos Ecosystem that issues these native assets themselves. Examples of this include: Kava for USDT (by Tether), Noble for USDC (by Circle), Neutron for wstETH (by Lido).

These canonical assets shall not have a suffix to avoid confusion about their issuance and to make clear that these assets are in fact not bridged assets but instead natively created assets by their issuer.&#x20;

## 5. Secret native SNIP-20 to SNIP-2X Assets

Native SNIP-20 to SNIP-2X assets should not have any prefixes or suffixes attached to their names.

\
\
