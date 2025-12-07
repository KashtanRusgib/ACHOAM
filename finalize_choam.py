import os, json, subprocess, glob

def main():
    if not os.path.exists('assets'): os.makedirs('assets')
    
    # Find any image in the root folder
    files = []
    for ext in ['*.png', '*.jpg', '*.jpeg', '*.webp']:
        files.extend(glob.glob(ext))
    
    # Use the first image found that isn't already the output icon
    src = next((f for f in files if 'assets/icon.png' not in f), None)
    
    if src:
        print(f"Found image: {src}")
        # Resize to 128x128
        subprocess.run(f'ffmpeg -y -i "{src}" -vf scale=128:128 assets/icon.png', shell=True)
        
        # Update package.json
        try:
            with open('package.json', 'r+') as f:
                data = json.load(f)
                data['icon'] = 'assets/icon.png'
                
                # Update the Sidebar Icon
                if 'contributes' in data and 'viewsContainers' in data['contributes']:
                    for item in data['contributes']['viewsContainers'].get('activitybar', []):
                        item['icon'] = 'assets/icon.png'
                        item['title'] = 'CHOAM'
                
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate()
                print("SUCCESS: Icon resized and package.json updated.")
        except Exception as e:
            print(f"Error updating JSON: {e}")
    else:
        print("ERROR: No .png or .jpg image found in the main folder to use as an icon.")

if __name__ == "__main__":
    main()
