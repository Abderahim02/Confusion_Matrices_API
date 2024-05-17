import csv
import matplotlib as matplotlib 
import os
import os



# list all files starting with prefix in the path directory
def get_files_ending_with(suffix, directory, order=lambda x: x):
    files = []
    for filename in os.listdir(directory):
        if filename.endswith(suffix):  
            file_path = os.path.join(directory, filename)
            with open(file_path, 'r') as file:
                lines = file.readlines()[1:]
                clean_lines = []
                for line in lines:
                    numbers = line.strip().split(",")[1:]
                    numbers = [ float(elm) for elm in numbers]
                    clean_lines.append(numbers)
                files.append([filename ,clean_lines])

    # Order the list of lists (filename and matrix)
    ordered_files = order(files)
    
    # Extract only the file names from the ordered list
    ordered_file_names = [os.path.join(directory, file[0]) for file in ordered_files]
    return ordered_file_names


#verify the structure of the .csv of one confusion matrix
def verify_csv_structure_for_one_file(csv_file):
    nb_lignes, nb_colonnes = 0, 0
    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        for i, row in enumerate(reader):
            nb_lignes += 1
            if i == 0:
                nb_colonnes = len(row) # la premièr ligne
            if i > 0:
                if len(row) != nb_colonnes:
                    return False
                for value in row[1:]:
                    try:
                        float_value = float(value)
                        if not (0 <= float_value <= 1):
                            return False
                    except ValueError:
                        return False
    if nb_lignes != nb_colonnes:
        return False
    return True, nb_colonnes, nb_lignes


#verify the structure of the .csv of multiple matrixes (for a visualiszation)
def verify_csv_structure_for_multiple_files(csv_files):
    matrixes_size = verify_csv_structure_for_one_file(csv_files[0])[1]
    # verify that all matrixes are squared
    for file in csv_files:
        verify_bool, size_col, size_lignes = verify_csv_structure_for_one_file(file)
        if not (verify_bool and size_lignes == matrixes_size):
            return False
    return True, matrixes_size


import os
import pandas as pd

def compatibility(csv_dir, verbose=False):
    # Get a list of all CSV files in the directory
    csv_files = [file for file in os.listdir(csv_dir) if file.endswith(".csv")]

    if not csv_files:
        print("No CSV files found in the directory.")
        return -1

    # Read the first CSV file
    first_file_path = os.path.join(csv_dir, csv_files[0])
    first_df = pd.read_csv(first_file_path)
    first_shape = first_df.shape

    # Check the rest of the CSV files
    for csv_file in csv_files[1:]:
        current_file_path = os.path.join(csv_dir, csv_file)

        # Read the current CSV file
        current_df = pd.read_csv(current_file_path)
        current_shape = current_df.shape

        # Compare the number of lines
        if current_shape[0] != first_shape[0]:
            print(f"Incompatible file: {csv_file} - Number of lines mismatch.")
            return -1

        # Compare the number of columns
        if current_shape[1] != first_shape[1]:
            print(f"Incompatible file: {csv_file} - Number of columns mismatch.")
            return -1

        # Compare the header
        if not current_df.columns.equals(first_df.columns):
            print(f"Incompatible file: {csv_file} - Header mismatch.")
            return -1

    if verbose:
        print("> Lines match       \t\t\t OK")
        print("> Columns match     \t\t\t OK")
        print("> Header match      \t\t\t OK")
    
    return 0

if __name__ == "__main__":
    csv_dir = "../res"
    compatibility(csv_dir, verbose=True)
