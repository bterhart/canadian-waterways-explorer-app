#!/usr/bin/env python3
"""
Comprehensive media audit for locations and waterways.
Checks hero images, gallery images, and video URLs.
"""

import json
import time
import urllib.request
import urllib.error
from urllib.parse import urlparse

BACKEND_URL = "https://preview-wcpymjlhfbqc.dev.vibecode.run"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
DELAY = 0.5


def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def check_url(url):
    """Return HTTP status code for a URL, or error string."""
    if not url:
        return None
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return "INVALID_URL"
    req = urllib.request.Request(url, headers=HEADERS, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return resp.status
    except urllib.error.HTTPError as e:
        # Try GET if HEAD fails
        try:
            req2 = urllib.request.Request(url, headers=HEADERS, method="GET")
            with urllib.request.urlopen(req2, timeout=15) as resp:
                return resp.status
        except urllib.error.HTTPError as e2:
            return e2.code
        except Exception as e2:
            return f"ERROR:{e2}"
    except Exception as e:
        return f"ERROR:{e}"


def is_video_url(url):
    if not url:
        return False
    lower = url.lower()
    return any(x in lower for x in ["youtube.com", "youtu.be", "vimeo.com", "video"])


def parse_gallery_images(gallery_raw):
    """Parse galleryImages which may be a JSON string or already a list."""
    if not gallery_raw:
        return []
    if isinstance(gallery_raw, list):
        return gallery_raw
    if isinstance(gallery_raw, str):
        try:
            parsed = json.loads(gallery_raw)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            pass
    return []


def parse_video_url(video_raw):
    """Parse videoUrl which may be a JSON string or plain string."""
    if not video_raw:
        return []
    if isinstance(video_raw, list):
        return video_raw
    if isinstance(video_raw, str):
        try:
            parsed = json.loads(video_raw)
            if isinstance(parsed, list):
                return parsed
            if isinstance(parsed, dict):
                return [parsed]
        except Exception:
            # Plain string URL
            return [{"url": video_raw}]
    return []


def get_gallery_urls(gallery_items):
    urls = []
    for item in gallery_items:
        if isinstance(item, dict):
            u = item.get("url") or item.get("imageUrl") or item.get("src")
            if u:
                urls.append(u)
        elif isinstance(item, str):
            urls.append(item)
    return urls


print("=" * 70)
print("COMPREHENSIVE MEDIA AUDIT")
print("=" * 70)

# ─────────────────────────────────────────────
# STEP 1: Fetch all locations
# ─────────────────────────────────────────────
print("\n[1/4] Fetching all locations...")
loc_list_data = fetch_json(f"{BACKEND_URL}/api/locations")
locations_list = loc_list_data.get("data", loc_list_data) if isinstance(loc_list_data, dict) else loc_list_data
print(f"  Found {len(locations_list)} locations")

# ─────────────────────────────────────────────
# STEP 2: Fetch full detail for each location
# ─────────────────────────────────────────────
print("\n[2/4] Fetching location details...")
locations = []
for i, loc in enumerate(locations_list):
    lid = loc["id"]
    lname = loc.get("name", "?")
    try:
        detail = fetch_json(f"{BACKEND_URL}/api/locations/{lid}")
        detail_data = detail.get("data", detail) if isinstance(detail, dict) else detail
        locations.append(detail_data)
        print(f"  [{i+1:3d}/{len(locations_list)}] {lname}")
    except Exception as e:
        print(f"  [{i+1:3d}/{len(locations_list)}] ERROR fetching {lname}: {e}")
        locations.append({"id": lid, "name": lname, "_fetch_error": str(e)})
    time.sleep(0.1)

# ─────────────────────────────────────────────
# STEP 3: Fetch all waterways
# ─────────────────────────────────────────────
print("\n[3/4] Fetching all waterways...")
wway_list_data = fetch_json(f"{BACKEND_URL}/api/waterways")
waterways_list = wway_list_data.get("data", wway_list_data) if isinstance(wway_list_data, dict) else wway_list_data
print(f"  Found {len(waterways_list)} waterways")

waterways = []
for i, wway in enumerate(waterways_list):
    wid = wway["id"]
    wname = wway.get("name", "?")
    try:
        detail = fetch_json(f"{BACKEND_URL}/api/waterways/{wid}")
        detail_data = detail.get("data", detail) if isinstance(detail, dict) else detail
        waterways.append(detail_data)
        print(f"  [{i+1:3d}/{len(waterways_list)}] {wname}")
    except Exception as e:
        print(f"  [{i+1:3d}/{len(waterways_list)}] ERROR fetching {wname}: {e}")
        waterways.append({"id": wid, "name": wname, "_fetch_error": str(e)})
    time.sleep(0.1)

# ─────────────────────────────────────────────
# STEP 4: Build URL checklist
# ─────────────────────────────────────────────
print("\n[4/4] Building URL check list...")

# Collect all unique image URLs to check
url_to_check = {}  # url -> list of (entity_type, entity_name, field)

def register_url(url, entity_type, entity_name, field):
    if not url or is_video_url(url):
        return
    if url not in url_to_check:
        url_to_check[url] = []
    url_to_check[url].append((entity_type, entity_name, field))

# Locations
loc_records = []
for loc in locations:
    if loc.get("_fetch_error"):
        continue
    name = loc.get("name", loc.get("id"))
    lid = loc.get("id")
    hero = loc.get("imageUrl")
    gallery_raw = loc.get("galleryImages")
    video_raw = loc.get("videoUrl")

    gallery_items = parse_gallery_images(gallery_raw)
    gallery_urls = get_gallery_urls(gallery_items)
    video_items = parse_video_url(video_raw)

    register_url(hero, "location", name, "hero")
    for j, gurl in enumerate(gallery_urls):
        register_url(gurl, "location", name, f"gallery[{j}]")

    # Hero-in-gallery checks
    hero_in_gallery = hero in gallery_urls if hero else False
    hero_is_last = False
    if hero and gallery_urls:
        hero_is_last = (gallery_urls[-1] == hero)

    loc_records.append({
        "id": lid,
        "name": name,
        "hero": hero,
        "gallery_items": gallery_items,
        "gallery_urls": gallery_urls,
        "video_items": video_items,
        "hero_in_gallery": hero_in_gallery,
        "hero_is_last": hero_is_last,
    })

# Waterways
wway_records = []
for wway in waterways:
    if wway.get("_fetch_error"):
        continue
    name = wway.get("name", wway.get("id"))
    wid = wway.get("id")
    hero = wway.get("imageUrl")
    gallery_raw = wway.get("galleryImages")
    video_raw = wway.get("videoUrl")

    gallery_items = parse_gallery_images(gallery_raw)
    gallery_urls = get_gallery_urls(gallery_items)
    video_items = parse_video_url(video_raw)

    register_url(hero, "waterway", name, "hero")
    for j, gurl in enumerate(gallery_urls):
        register_url(gurl, "waterway", name, f"gallery[{j}]")

    hero_in_gallery = hero in gallery_urls if hero else False
    hero_is_last = False
    if hero and gallery_urls:
        hero_is_last = (gallery_urls[-1] == hero)

    wway_records.append({
        "id": wid,
        "name": name,
        "hero": hero,
        "gallery_items": gallery_items,
        "gallery_urls": gallery_urls,
        "video_items": video_items,
        "hero_in_gallery": hero_in_gallery,
        "hero_is_last": hero_is_last,
    })

print(f"  Unique image URLs to check: {len(url_to_check)}")

# ─────────────────────────────────────────────
# STEP 5: HTTP checks
# ─────────────────────────────────────────────
print("\n[5/5] Checking URLs (this will take a while)...")
url_status = {}
total = len(url_to_check)
for i, url in enumerate(url_to_check):
    status = check_url(url)
    url_status[url] = status
    marker = "OK" if status == 200 else f"*** {status} ***"
    print(f"  [{i+1:4d}/{total}] {marker} {url[:90]}")
    time.sleep(DELAY)

# ─────────────────────────────────────────────
# RESULTS
# ─────────────────────────────────────────────
print("\n" + "=" * 70)
print("AUDIT RESULTS")
print("=" * 70)

# Helper
def status_ok(s):
    return s == 200

# ── LOCATIONS ──────────────────────────────────────────────────────────
print("\n━━━ LOCATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

bad_hero_locs = []
bad_gallery_locs = []
dup_hero_locs = []
hero_not_last_locs = []
no_hero_locs = []
no_gallery_locs = []

for rec in loc_records:
    name = rec["name"]
    hero = rec["hero"]
    gallery_urls = rec["gallery_urls"]

    if not hero:
        no_hero_locs.append(name)
    else:
        hs = url_status.get(hero)
        if hs is not None and not status_ok(hs):
            bad_hero_locs.append((name, hero, hs))

    if not gallery_urls:
        no_gallery_locs.append(name)
    else:
        for gurl in gallery_urls:
            gs = url_status.get(gurl)
            if gs is not None and not status_ok(gs):
                bad_gallery_locs.append((name, gurl, gs))

    if rec["hero_in_gallery"]:
        dup_hero_locs.append(name)

    if hero and gallery_urls and not rec["hero_is_last"]:
        hero_not_last_locs.append(name)

print(f"\n[1] LOCATIONS WITH BAD HERO IMAGE (non-200):")
if bad_hero_locs:
    for name, url, status in bad_hero_locs:
        print(f"    STATUS {status}  {name}")
        print(f"           {url}")
else:
    print("    None — all hero images returned 200")

print(f"\n[2] LOCATIONS WITH BAD GALLERY IMAGE (non-200):")
if bad_gallery_locs:
    seen = set()
    for name, url, status in bad_gallery_locs:
        key = (name, url)
        if key not in seen:
            seen.add(key)
            print(f"    STATUS {status}  {name}")
            print(f"           {url}")
else:
    print("    None — all gallery images returned 200")

print(f"\n[3] LOCATIONS WHERE HERO IS ALSO IN GALLERY (duplicates):")
if dup_hero_locs:
    for name in dup_hero_locs:
        rec = next(r for r in loc_records if r["name"] == name)
        print(f"    {name}")
        print(f"      Hero: {rec['hero']}")
else:
    print("    None — no duplicates found")

print(f"\n[4] LOCATIONS WHERE HERO IS NOT LAST IN GALLERY:")
if hero_not_last_locs:
    for name in hero_not_last_locs:
        rec = next(r for r in loc_records if r["name"] == name)
        gurls = rec["gallery_urls"]
        print(f"    {name}")
        print(f"      Hero:  {rec['hero']}")
        print(f"      Last:  {gurls[-1] if gurls else 'N/A'}")
        print(f"      Gallery count: {len(gurls)}")
else:
    print("    None — hero is last in all galleries (or gallery is empty)")

print(f"\n[5] LOCATIONS WITH NO HERO IMAGE:")
if no_hero_locs:
    for n in no_hero_locs:
        print(f"    {n}")
else:
    print("    None")

print(f"\n[6] LOCATIONS WITH NO GALLERY IMAGES:")
if no_gallery_locs:
    for n in no_gallery_locs:
        print(f"    {n}")
else:
    print("    None")

# ── WATERWAYS ──────────────────────────────────────────────────────────
print("\n━━━ WATERWAYS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

bad_hero_wways = []
bad_gallery_wways = []
dup_hero_wways = []
hero_not_last_wways = []
no_hero_wways = []
no_gallery_wways = []

for rec in wway_records:
    name = rec["name"]
    hero = rec["hero"]
    gallery_urls = rec["gallery_urls"]

    if not hero:
        no_hero_wways.append(name)
    else:
        hs = url_status.get(hero)
        if hs is not None and not status_ok(hs):
            bad_hero_wways.append((name, hero, hs))

    if not gallery_urls:
        no_gallery_wways.append(name)
    else:
        for gurl in gallery_urls:
            gs = url_status.get(gurl)
            if gs is not None and not status_ok(gs):
                bad_gallery_wways.append((name, gurl, gs))

    if rec["hero_in_gallery"]:
        dup_hero_wways.append(name)

    if hero and gallery_urls and not rec["hero_is_last"]:
        hero_not_last_wways.append(name)

print(f"\n[1] WATERWAYS WITH BAD HERO IMAGE (non-200):")
if bad_hero_wways:
    for name, url, status in bad_hero_wways:
        print(f"    STATUS {status}  {name}")
        print(f"           {url}")
else:
    print("    None — all hero images returned 200")

print(f"\n[2] WATERWAYS WITH BAD GALLERY IMAGE (non-200):")
if bad_gallery_wways:
    seen = set()
    for name, url, status in bad_gallery_wways:
        key = (name, url)
        if key not in seen:
            seen.add(key)
            print(f"    STATUS {status}  {name}")
            print(f"           {url}")
else:
    print("    None — all gallery images returned 200")

print(f"\n[3] WATERWAYS WHERE HERO IS ALSO IN GALLERY (duplicates):")
if dup_hero_wways:
    for name in dup_hero_wways:
        rec = next(r for r in wway_records if r["name"] == name)
        print(f"    {name}")
        print(f"      Hero: {rec['hero']}")
else:
    print("    None — no duplicates found")

print(f"\n[4] WATERWAYS WHERE HERO IS NOT LAST IN GALLERY:")
if hero_not_last_wways:
    for name in hero_not_last_wways:
        rec = next(r for r in wway_records if r["name"] == name)
        gurls = rec["gallery_urls"]
        print(f"    {name}")
        print(f"      Hero:  {rec['hero']}")
        print(f"      Last:  {gurls[-1] if gurls else 'N/A'}")
        print(f"      Gallery count: {len(gurls)}")
else:
    print("    None — hero is last in all galleries (or gallery is empty)")

print(f"\n[5] WATERWAYS WITH NO HERO IMAGE:")
if no_hero_wways:
    for n in no_hero_wways:
        print(f"    {n}")
else:
    print("    None")

print(f"\n[6] WATERWAYS WITH NO GALLERY IMAGES:")
if no_gallery_wways:
    for n in no_gallery_wways:
        print(f"    {n}")
else:
    print("    None")

# ── SUMMARY ────────────────────────────────────────────────────────────
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
total_urls_checked = len(url_status)
ok_urls = sum(1 for s in url_status.values() if s == 200)
bad_urls = total_urls_checked - ok_urls

print(f"\nURLs checked:              {total_urls_checked}")
print(f"  ✓ 200 OK:                {ok_urls}")
print(f"  ✗ Non-200:               {bad_urls}")
print(f"\nLocations audited:         {len(loc_records)}")
print(f"  Bad hero images:         {len(bad_hero_locs)}")
print(f"  Bad gallery images:      {len(set((n,u) for n,u,s in bad_gallery_locs))}")
print(f"  Hero duplicated in gallery: {len(dup_hero_locs)}")
print(f"  Hero NOT last in gallery:   {len(hero_not_last_locs)}")
print(f"  No hero image:           {len(no_hero_locs)}")
print(f"  No gallery images:       {len(no_gallery_locs)}")
print(f"\nWaterways audited:         {len(wway_records)}")
print(f"  Bad hero images:         {len(bad_hero_wways)}")
print(f"  Bad gallery images:      {len(set((n,u) for n,u,s in bad_gallery_wways))}")
print(f"  Hero duplicated in gallery: {len(dup_hero_wways)}")
print(f"  Hero NOT last in gallery:   {len(hero_not_last_wways)}")
print(f"  No hero image:           {len(no_hero_wways)}")
print(f"  No gallery images:       {len(no_gallery_wways)}")

# ── DETAILED INVENTORY ─────────────────────────────────────────────────
print("\n" + "=" * 70)
print("FULL INVENTORY")
print("=" * 70)

print("\n─── LOCATION INVENTORY ───")
for rec in sorted(loc_records, key=lambda r: r["name"]):
    hero_status = url_status.get(rec["hero"], "SKIPPED") if rec["hero"] else "MISSING"
    print(f"\n  {rec['name']}")
    print(f"    Hero:    [{hero_status}] {rec['hero'] or 'NONE'}")
    if rec["gallery_urls"]:
        print(f"    Gallery: {len(rec['gallery_urls'])} images")
        for j, gu in enumerate(rec["gallery_urls"]):
            gs = url_status.get(gu, "SKIPPED")
            is_last = "←LAST" if j == len(rec["gallery_urls"]) - 1 else ""
            is_hero = "←HERO" if gu == rec["hero"] else ""
            print(f"      [{j}] [{gs}] {gu[:80]} {is_last}{is_hero}")
    else:
        print(f"    Gallery: NONE")
    if rec["video_items"]:
        for vi in rec["video_items"]:
            vu = vi.get("url") if isinstance(vi, dict) else vi
            print(f"    Video:   {vu}")

print("\n─── WATERWAY INVENTORY ───")
for rec in sorted(wway_records, key=lambda r: r["name"]):
    hero_status = url_status.get(rec["hero"], "SKIPPED") if rec["hero"] else "MISSING"
    print(f"\n  {rec['name']}")
    print(f"    Hero:    [{hero_status}] {rec['hero'] or 'NONE'}")
    if rec["gallery_urls"]:
        print(f"    Gallery: {len(rec['gallery_urls'])} images")
        for j, gu in enumerate(rec["gallery_urls"]):
            gs = url_status.get(gu, "SKIPPED")
            is_last = "←LAST" if j == len(rec["gallery_urls"]) - 1 else ""
            is_hero = "←HERO" if gu == rec["hero"] else ""
            print(f"      [{j}] [{gs}] {gu[:80]} {is_last}{is_hero}")
    else:
        print(f"    Gallery: NONE")
    if rec["video_items"]:
        for vi in rec["video_items"]:
            vu = vi.get("url") if isinstance(vi, dict) else vi
            print(f"    Video:   {vu}")

print("\n[AUDIT COMPLETE]")
