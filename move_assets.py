#!/usr/bin/env python3
import os
import shutil

os.chdir('/workspaces/ACHOAM')

# Copy and rename files
files_to_move = {
    'choam_logo.png': 'choam_logo_128x128px.png',
    'robot_icon.png': 'robot_icon_128x128px.png'
}

for src_name, dst_name in files_to_move.items():
    if os.path.exists(src_name):
        # Copy to create renamed version
        shutil.copy(src_name, dst_name)
        print(f"Created {dst_name}")
        
        # Move to assets folder
        dest_path = os.path.join('assets', dst_name)
        shutil.move(dst_name, dest_path)
        print(f"Moved {dst_name} to assets/")
    else:
        print(f"Warning: {src_name} not found")

# Verify
print("\nFiles in assets/:")
for f in os.listdir('assets'):
    if f.endswith('.png'):
        print(f"  - {f}")
