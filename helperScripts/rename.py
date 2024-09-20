import os
import re

def get_next_available_number(existing_numbers):
    if not existing_numbers:
        return 1
    for i in range(1, max(existing_numbers) + 2):
        if i not in existing_numbers:
            return i

def rename_files():
    # Get all files in the current directory
    files = [f for f in os.listdir('.') if os.path.isfile(f)]
    
    # Extract existing art numbers
    existing_numbers = set()
    pattern = re.compile(r'^art(\d+)\.jpg$')  # Only look for .jpg files here
    
    for file in files:
        match = pattern.match(file)
        if match:
            existing_numbers.add(int(match.group(1)))
    
    # Rename files
    for file in files:
        # Skip rename.py and correctly named .jpg files
        if file == 'rename.py' or pattern.match(file):
            continue
        
        # Check if it's a .jpg or .jpeg file
        if file.lower().endswith('.jpg') or file.lower().endswith('.jpeg') or file.lower().endswith('.webp'):
            next_number = get_next_available_number(existing_numbers)
            new_name = f'art{next_number}.jpg'
            
            # Rename the file
            os.rename(file, new_name)
            print(f'Renamed "{file}" to "{new_name}"')
            
            # Add the new number to existing numbers
            existing_numbers.add(next_number)

if __name__ == "__main__":
    rename_files()