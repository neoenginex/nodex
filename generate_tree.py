import os
import sys

def generate_tree(directory, prefix="", ignore_dirs=None, ignore_files=None):
    """
    Generate a tree structure of directories and files.
    
    Args:
        directory: Root directory to scan
        prefix: Current prefix for tree formatting
        ignore_dirs: Set of directory names to ignore
        ignore_files: Set of file names to ignore
    """
    if ignore_dirs is None:
        ignore_dirs = {'.git', 'node_modules', '.next', '__pycache__', '.env'}
    
    if ignore_files is None:
        ignore_files = {'.DS_Store', 'Thumbs.db', '.gitkeep'}
    
    try:
        # Get all items in the directory
        items = []
        for item in os.listdir(directory):
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path) and item not in ignore_dirs:
                items.append((item, 'dir'))
            elif os.path.isfile(item_path) and item not in ignore_files:
                items.append((item, 'file'))
        
        # Sort items: directories first, then files, both alphabetically
        items.sort(key=lambda x: (x[1] == 'file', x[0].lower()))
        
        for i, (item, item_type) in enumerate(items):
            is_last = i == len(items) - 1
            current_prefix = "└── " if is_last else "├── "
            
            if item_type == 'dir':
                print(f"{prefix}{current_prefix}{item}/")
                # Recursive call for subdirectories
                extension_prefix = "    " if is_last else "│   "
                generate_tree(
                    os.path.join(directory, item), 
                    prefix + extension_prefix,
                    ignore_dirs,
                    ignore_files
                )
            else:
                print(f"{prefix}{current_prefix}{item}")
                
    except PermissionError:
        print(f"{prefix}[Permission Denied]")
    except Exception as e:
        print(f"{prefix}[Error: {e}]")

def main():
    # Get the directory to scan (default to current directory)
    if len(sys.argv) > 1:
        root_dir = sys.argv[1]
    else:
        root_dir = "."
    
    # Ensure the directory exists
    if not os.path.exists(root_dir):
        print(f"Error: Directory '{root_dir}' does not exist.")
        return
    
    if not os.path.isdir(root_dir):
        print(f"Error: '{root_dir}' is not a directory.")
        return
    
    # Get the absolute path and directory name
    abs_path = os.path.abspath(root_dir)
    dir_name = os.path.basename(abs_path)
    
    print(f"{dir_name}/")
    generate_tree(root_dir)

if __name__ == "__main__":
    main()
