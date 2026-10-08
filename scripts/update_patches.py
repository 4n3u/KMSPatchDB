import os
import json
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
PATCHES_FILE = os.path.join(DATA_DIR, 'patches.json')
SUMMARY_FILE = os.path.join(DATA_DIR, 'summary.json')

BASE_URL = "https://maplestory.dn.nexoncdn.co.kr"

def check_url_head(url):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'},
        method='HEAD'
    )
    try:
        with urllib.request.urlopen(req, timeout=4) as response:
            if response.status == 200:
                content_length = response.headers.get('Content-Length')
                last_modified = response.headers.get('Last-Modified', '')
                size_bytes = int(content_length) if content_length else 0
                size_mb = round(size_bytes / (1024 * 1024), 2)
                return {
                    'url': url,
                    'exists': True,
                    'sizeBytes': size_bytes,
                    'sizeMb': size_mb,
                    'lastModified': last_modified
                }
    except Exception:
        pass
    return {'url': url, 'exists': False}

def update():
    if not os.path.exists(PATCHES_FILE):
        print(f"Patches file not found at {PATCHES_FILE}.")
        return

    with open(PATCHES_FILE, 'r', encoding='utf-8') as f:
        patches = json.load(f)

    existing_urls = {p['url'] for p in patches}
    tasks = []

    # 1. Candidate KMS URLs
    kms_targets = [p['targetVer'] for p in patches if p['server'] == 'KMS']
    kms_max = max(kms_targets) if kms_targets else 419

    for target in range(kms_max, kms_max + 4):
        # Major
        for diff in range(1, 6):
            source = target - diff
            if source < 1:
                continue
            url = f"{BASE_URL}/Patch/{target:05d}/{source:05d}to{target:05d}.patch"
            if url not in existing_urls:
                tasks.append({
                    'url': url,
                    'server': 'KMS',
                    'type': 'major',
                    'targetVer': target,
                    'sourceVer': source,
                    'sourceMinor': None,
                    'targetMinor': None,
                    'filename': f"{source:05d}to{target:05d}.patch",
                    'sourceDisplay': f"1.2.{source}",
                    'targetDisplay': f"1.2.{target}"
                })

        # Minor (up to minor 10)
        for s_min in range(1, 10):
            for t_min in range(s_min + 1, 11):
                url = f"{BASE_URL}/Patch/{target:05d}/Minor/{s_min:02d}to{t_min:02d}.patch"
                if url not in existing_urls:
                    tasks.append({
                        'url': url,
                        'server': 'KMS',
                        'type': 'minor',
                        'targetVer': target,
                        'sourceVer': target,
                        'sourceMinor': s_min,
                        'targetMinor': t_min,
                        'filename': f"{s_min:02d}to{t_min:02d}.patch",
                        'sourceDisplay': f"1.2.{target} (Minor {s_min})",
                        'targetDisplay': f"1.2.{target} (Minor {t_min})"
                    })

    # 2. Candidate KMST URLs
    kmst_targets = [p['targetVer'] for p in patches if p['server'] == 'KMST']
    kmst_max = max(kmst_targets) if kmst_targets else 1206

    for target in range(kmst_max, kmst_max + 4):
        # Major
        for diff in range(1, 5):
            source = target - diff
            url = f"{BASE_URL}/PatchT/{target:05d}/{source:05d}to{target:05d}.patch"
            if url not in existing_urls:
                t_sub = target - 1000 if target >= 1000 else target
                s_sub = source - 1000 if source >= 1000 else source
                tasks.append({
                    'url': url,
                    'server': 'KMST',
                    'type': 'major',
                    'targetVer': target,
                    'sourceVer': source,
                    'sourceMinor': None,
                    'targetMinor': None,
                    'filename': f"{source:05d}to{target:05d}.patch",
                    'sourceDisplay': f"1.2.{s_sub:03d}" if s_sub < 1000 else f"{source}",
                    'targetDisplay': f"1.2.{t_sub:03d}" if t_sub < 1000 else f"{target}"
                })

        # Minor
        for s_min in range(1, 6):
            for t_min in range(s_min + 1, 7):
                url = f"{BASE_URL}/PatchT/{target:05d}/Minor/{s_min:02d}to{t_min:02d}.patch"
                if url not in existing_urls:
                    t_sub = target - 1000 if target >= 1000 else target
                    tasks.append({
                        'url': url,
                        'server': 'KMST',
                        'type': 'minor',
                        'targetVer': target,
                        'sourceVer': target,
                        'sourceMinor': s_min,
                        'targetMinor': t_min,
                        'filename': f"{s_min:02d}to{t_min:02d}.patch",
                        'sourceDisplay': f"1.2.{t_sub:03d} (Minor {s_min})",
                        'targetDisplay': f"1.2.{t_sub:03d} (Minor {t_min})"
                    })

    # Execute concurrent HEAD checks
    task_map = {t['url']: t for t in tasks}
    new_found = []

    if tasks:
        with ThreadPoolExecutor(max_workers=16) as executor:
            futures = [executor.submit(check_url_head, t['url']) for t in tasks]
            for future in as_completed(futures):
                res = future.result()
                if res['exists']:
                    t_info = task_map[res['url']]
                    item = {
                        "id": f"{t_info['server'].lower()}-{t_info['type']}-{t_info['filename'].replace('.', '_')}-{t_info['targetVer']}",
                        "server": t_info['server'],
                        "type": t_info['type'],
                        "url": res['url'],
                        "filename": t_info['filename'],
                        "sizeBytes": res['sizeBytes'],
                        "sizeMb": res['sizeMb'],
                        "lastModified": res['lastModified'],
                        "timestamp": res['lastModified'],
                        "targetVer": t_info['targetVer'],
                        "sourceVer": t_info['sourceVer'],
                        "sourceMinor": t_info['sourceMinor'],
                        "targetMinor": t_info['targetMinor'],
                        "sourceDisplay": t_info['sourceDisplay'],
                        "targetDisplay": t_info['targetDisplay']
                    }
                    patches.append(item)
                    new_found.append(item)

    print(f"Scan complete. Checked {len(tasks)} candidates concurrently. Found: {len(new_found)} new.")

    if not new_found:
        print("No new patches found. Database and updatedAt remain unchanged.")
        return

    # Sort patches cleanly
    patches.sort(key=lambda p: (
        p['server'],
        p['targetVer'],
        p['type'] == 'minor',
        p.get('targetMinor') or 0,
        p.get('sourceMinor') or p.get('sourceVer') or 0
    ), reverse=True)

    # Update summary
    kms_patches = [p for p in patches if p['server'] == 'KMS']
    kmst_patches = [p for p in patches if p['server'] == 'KMST']
    kms_max = max((p['targetVer'] for p in kms_patches), default=0)
    kmst_max = max((p['targetVer'] for p in kmst_patches), default=0)
    kmst_sub = kmst_max - 1000 if kmst_max >= 1000 else kmst_max

    summary = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "totalPatches": len(patches),
        "kms": {
            "total": len(kms_patches),
            "major": len([p for p in kms_patches if p['type'] == 'major']),
            "minor": len([p for p in kms_patches if p['type'] == 'minor']),
            "latestVer": kms_max,
            "latestDisplay": f"1.2.{kms_max}",
            "totalSizeMb": round(sum(p['sizeMb'] for p in kms_patches), 2)
        },
        "kmst": {
            "total": len(kmst_patches),
            "major": len([p for p in kmst_patches if p['type'] == 'major']),
            "minor": len([p for p in kmst_patches if p['type'] == 'minor']),
            "latestVer": kmst_max,
            "latestDisplay": f"1.2.{kmst_sub:03d}",
            "totalSizeMb": round(sum(p['sizeMb'] for p in kmst_patches), 2)
        }
    }

    with open(PATCHES_FILE, 'w', encoding='utf-8') as f:
        json.dump(patches, f, ensure_ascii=False, indent=2)

    with open(SUMMARY_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    update()
