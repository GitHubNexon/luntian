import os
import sys

def rename_files(folder_path, base_name, start_number, file_extension):
    if not os.path.isdir(folder_path):
        print(f"The folder path '{folder_path}' does not exist.")
        return

    # Get all files in the folder
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]

    files.sort()

    for i, file in enumerate(files, start=start_number):
        old_file_path = os.path.join(folder_path, file)
        new_file_name = f"{base_name}{i}.{file_extension}"
        new_file_path = os.path.join(folder_path, new_file_name)
        
        # Rename the file
        os.rename(old_file_path, new_file_path)
        print(f"Renamed '{file}' to '{new_file_name}'")

def rename_file(folder_path, old_name, new_name):
    old_file_path = os.path.join(folder_path, old_name)
    new_file_path = os.path.join(folder_path, new_name)
    
    # Check if the old file exists
    if not os.path.isfile(old_file_path):
        print(f"The file '{old_name}' does not exist in '{folder_path}'.")
        return
    
    # Rename the specific file
    os.rename(old_file_path, new_file_path)
    print(f"Renamed '{old_name}' to '{new_name}'")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Rename multiple files: python Rename.py <folder_path> <file_name> <start_number> <file_extension>")
        print("  Rename a single file: python Rename.py <folder_path> <old_file_name> <new_file_name>")
        sys.exit(1)

    folder_path = sys.argv[1]

    if len(sys.argv) == 5:
        # Rename multiple files
        base_name = sys.argv[2]
        start_number = int(sys.argv[3])
        file_extension = sys.argv[4]
        rename_files(folder_path, base_name, start_number, file_extension)
    elif len(sys.argv) == 4:
        # Rename a specific file
        old_name = sys.argv[2]
        new_name = sys.argv[3]
        rename_file(folder_path, old_name, new_name)
    else:
        print("Invalid number of arguments.")

# How to Run the Script
# How to Rename a Multiple Files
# python Rename.py <folder_path> <file_name> <start_number> <file_extension>

# example
# python Rename.py "C:/path/to/folder" "image" 1 "jpg"


# How to Rename a Specific File 
# python Rename.py <folder_path> <old_file_name> <new_file_name>

# Example:
# python Rename.py "C:/path/to/folder" "old_name.jpg" "new_name.jpg"
