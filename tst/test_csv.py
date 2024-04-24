import os
import csv

def check_rows_columns_equal(csv_file_path):
    with open(csv_file_path, 'r') as file:
        csv_reader = csv.reader(file)
        num_columns = len(next(csv_reader))-1
        num_rows = sum(1 for _ in csv_reader)
        
    if num_rows != num_columns:
        print(f"Error in file '{csv_file_path}': Number of rows ({num_rows}) is not equal to the number of columns ({num_columns}).")
        return -1
    return 0

def check_elements_per_row(csv_file_path):
    error = False
    with open(csv_file_path, 'r') as file:
        csv_reader = csv.reader(file)
        num_columns = len(next(csv_reader))-1
        for i, row in enumerate(csv_reader, start=1):
            if len(row)-1 != num_columns:
                print(f"Error in file '{csv_file_path}': Number of elements in row {i} ({len(row)-1}) is not consistent with the number of columns ({num_columns}).")
                error = True
        if error:
            return -1
    return 0

def check_row_equals_column_names(csv_file_path):
    error = False
    with open(csv_file_path, 'r') as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader)
        for i, row in enumerate(csv_reader, start=1):
            if row[0] != header[i]:
                print(f"Error in file '{csv_file_path}': name of the row {i} does not match the corresponding column name ({header[i]}).")
                error = True
        if error:
            return -1
    return 0

def check_elements_are_numbers(csv_file_path):
    error = False
    with open(csv_file_path, 'r') as file:
        csv_reader = csv.reader(file)
        for i, row in enumerate(csv_reader, start=1):
            for j, element in enumerate(row, start=1):
                if j != 1 and not element.replace('.', '', 1).isdigit():
                    print(f"Error in file '{csv_file_path}': Element in row {i-1}, column {j-1} is not a number.")
                    error = True
    if error:
        return -1
    return 0


def test_all_csv_files(csv_dir, verbose=True):
    csv_files = [file for file in os.listdir(csv_dir) if file.endswith(".csv")]

    for csv_file in csv_files:
        file_path = os.path.join(csv_dir, csv_file)
        if verbose:
            print(f"Testing file: {file_path}")

        result_rows_columns = check_rows_columns_equal(file_path)
        result_elements_per_row = -1
        if result_rows_columns==0:
            result_elements_per_row = check_elements_per_row(file_path)
        result_row_equals_column_names = -1
        if result_elements_per_row==0 :
            result_row_equals_column_names = check_row_equals_column_names(file_path)
        result_elements_are_numbers= check_elements_are_numbers(file_path)

        if verbose:
            print(f"> Lines equal Columns       \t\t\t {'OK' if result_rows_columns == 0 else 'Failed'}")
            print(f"> Same Length Lines     \t\t\t {'OK' if result_elements_per_row == 0 else 'Failed'}")
            print(f"> Same Lines and Columns Names  \t\t {'OK' if result_row_equals_column_names == 0 else 'Failed'}")
            print(f"> ELEMENTS ARE NUMBERS  \t\t {'OK' if result_elements_are_numbers == 0 else 'Failed'}")

        if result_rows_columns == 0 and result_elements_per_row == 0 and result_row_equals_column_names == 0 and result_elements_are_numbers==0:
            if verbose:
                print("All tests passed for this file.\n")
        else:
            if verbose:
                print("Tests failed for this file.\n")

if __name__ == "__main__":
    csv_dir = "./res_tst"
    test_all_csv_files(csv_dir, verbose=True)