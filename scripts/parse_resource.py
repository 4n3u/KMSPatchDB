import os
import re
import json
from datetime import datetime, timezone

RESOURCE_FILE = os.path.join(os.path.dirname(__file__), '..', '.resource', 'maple_available_patches.txt')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'patches.json')
SUMMARY_FILE = os.path.join(OUTPUT_DIR, 'summary.json')

def parse_patches():
    if not os.path.exists(RESOURCE_FILE):
        print(f"Resource file not found: {RESOURCE_FILE}")
        return

    patches = []
    seen_urls = set()
    
    with open(RESOURCE_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or line.startswith('==='):
                continue
            
            parts = [p.strip() for p in line.split('|')]
            if len(parts) < 4:
                continue
            
            url = parts[0]
            if url in seen_urls:
                continue
            seen_urls.add(url)

            size_b_str = parts[1].replace('B', '').replace(',', '').strip()
            size_mb_str = parts[2].replace('MB', '').strip()
            last_modified = parts[3].strip()
            
            try:
                size_bytes = int(size_b_str)
            except ValueError:
                size_bytes = 0
                
            try:
                size_mb = float(size_mb_str)
            except ValueError:
                size_mb = 0.0
                
            server = None
            patch_type = None
            source_ver = None
            target_ver = None
            source_minor = None
            target_minor = None
            target_display = None
            source_display = None
            
            kms_major = re.search(r'/Patch/(\d{5})/(\d{5})to(\d{5})\.patch$', url)
            kms_minor = re.search(r'/Patch/(\d{5})/Minor/(\d{2})to(\d{2})\.patch$', url)
            kmst_major = re.search(r'/PatchT/(\d{5})/(\d{5})to(\d{5})\.patch$', url)
            kmst_minor = re.search(r'/PatchT/(\d{5})/Minor/(\d{2})to(\d{2})\.patch$', url)
            
            if kms_major:
                server = 'KMS'
                patch_type = 'major'
                target_ver = int(kms_major.group(1))
                source_ver = int(kms_major.group(2))
                target_display = f"1.2.{target_ver}"
                source_display = f"1.2.{source_ver}"
            elif kms_minor:
                server = 'KMS'
                patch_type = 'minor'
                target_ver = int(kms_minor.group(1))
                source_ver = target_ver
                source_minor = int(kms_minor.group(2))
                target_minor = int(kms_minor.group(3))
                target_display = f"1.2.{target_ver} (Minor {target_minor})"
                source_display = f"1.2.{target_ver} (Minor {source_minor})"
            elif kmst_major:
                server = 'KMST'
                patch_type = 'major'
                target_ver = int(kmst_major.group(1))
                source_ver = int(kmst_major.group(2))
                t_sub = target_ver - 1000 if target_ver >= 1000 else target_ver
                s_sub = source_ver - 1000 if source_ver >= 1000 else source_ver
                target_display = f"1.2.{t_sub:03d}" if t_sub < 1000 else f"{target_ver}"
                source_display = f"1.2.{s_sub:03d}" if s_sub < 1000 else f"{source_ver}"
            elif kmst_minor:
                server = 'KMST'
                patch_type = 'minor'
                target_ver = int(kmst_minor.group(1))
                source_ver = target_ver
                source_minor = int(kmst_minor.group(2))
                target_minor = int(kmst_minor.group(3))
                t_sub = target_ver - 1000 if target_ver >= 1000 else target_ver
                target_display = f"1.2.{t_sub:03d} (Minor {target_minor})"
                source_display = f"1.2.{t_sub:03d} (Minor {source_minor})"
            else:
                continue

            timestamp = None
            try:
                dt = datetime.strptime(last_modified, "%a, %d %b %Y %H:%M:%S GMT")
                timestamp = dt.isoformat() + "Z"
            except Exception:
                timestamp = last_modified
                
            filename = url.split('/')[-1]
            
            patches.append({
                "id": f"{server.lower()}-{patch_type}-{filename.replace('.', '_')}-{target_ver}",
                "server": server,
                "type": patch_type,
                "url": url,
                "filename": filename,
                "sizeBytes": size_bytes,
                "sizeMb": size_mb,
                "lastModified": last_modified,
                "timestamp": timestamp,
                "targetVer": target_ver,
                "sourceVer": source_ver,
                "sourceMinor": source_minor,
                "targetMinor": target_minor,
                "sourceDisplay": source_display,
                "targetDisplay": target_display
            })

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(patches, f, ensure_ascii=False, indent=2)

    # Generate summary
    kms_patches = [p for p in patches if p['server'] == 'KMS']
    kmst_patches = [p for p in patches if p['server'] == 'KMST']
    
    kms_targets = [p['targetVer'] for p in kms_patches]
    kmst_targets = [p['targetVer'] for p in kmst_patches]
    
    latest_kms = max(kms_targets) if kms_targets else 0
    latest_kmst = max(kmst_targets) if kmst_targets else 0
    
    kms_latest_display = f"1.2.{latest_kms}"
    kmst_sub = latest_kmst - 1000 if latest_kmst >= 1000 else latest_kmst
    kmst_latest_display = f"1.2.{kmst_sub:03d}"
    
    summary = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "totalPatches": len(patches),
        "kms": {
            "total": len(kms_patches),
            "major": len([p for p in kms_patches if p['type'] == 'major']),
            "minor": len([p for p in kms_patches if p['type'] == 'minor']),
            "latestVer": latest_kms,
            "latestDisplay": kms_latest_display,
            "totalSizeMb": round(sum(p['sizeMb'] for p in kms_patches), 2)
        },
        "kmst": {
            "total": len(kmst_patches),
            "major": len([p for p in kmst_patches if p['type'] == 'major']),
            "minor": len([p for p in kmst_patches if p['type'] == 'minor']),
            "latestVer": latest_kmst,
            "latestDisplay": kmst_latest_display,
            "totalSizeMb": round(sum(p['sizeMb'] for p in kmst_patches), 2)
        }
    }

    with open(SUMMARY_FILE, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"Successfully parsed {len(patches)} unique patches (Deduplicated).")
    print(f"KMS: {len(kms_patches)} (Latest: {kms_latest_display})")
    print(f"KMST: {len(kmst_patches)} (Latest: {kmst_latest_display})")

if __name__ == '__main__':
    parse_patches()
