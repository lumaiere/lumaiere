import os

CHUNK_SIZE = 511 * 1024 * 1024  # 511 MB
INPUT_DIR = os.getcwd()
OUTPUT_DIR = 'merged_output'
os.makedirs(OUTPUT_DIR, exist_ok=True)

def merge_md_files_to_chunks(input_dir, output_dir, chunk_size):
    files = [
        f for f in os.listdir(input_dir)
        if f.endswith('.md') and 'scratch' not in f.lower() and os.path.isfile(os.path.join(input_dir, f))
    ]

    chunk_index = 1
    current_chunk_size = 0
    current_chunk_path = os.path.join(output_dir, f'chunk_{chunk_index}.txt')
    current_chunk = open(current_chunk_path, 'wb')

    for filename in files:
        filepath = os.path.join(input_dir, filename)
        try:
            with open(filepath, 'rb') as f:
                header = f"\n--- FILE: {filename} ---\n".encode('utf-8')
                content = f.read()
                total_size = len(header) + len(content)

                if current_chunk_size + total_size > chunk_size:
                    current_chunk.close()
                    chunk_index += 1
                    current_chunk_size = 0
                    current_chunk_path = os.path.join(output_dir, f'chunk_{chunk_index}.txt')
                    current_chunk = open(current_chunk_path, 'wb')

                current_chunk.write(header)
                current_chunk.write(content)
                current_chunk_size += total_size
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    current_chunk.close()

merge_md_files_to_chunks(INPUT_DIR, OUTPUT_DIR, CHUNK_SIZE)
