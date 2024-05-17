import csv
import json
import matplotlib as matplotlib 
import json
from csv_verificator import *
import os.path


# this function returns the (i,j) celle from the matrix in the csv file
def get_i_j_cell_from_csv(x,y, csv_file): #x : the ligne, y : the column
    with open(csv_file, 'r') as csv_file:
        reader = csv.reader(csv_file)
        for i, row in enumerate(reader):
            for j, value in enumerate(row[0:]):
                if i  == x  and j == y :
                    return float(value)


#create the visualisation 1 for csv_fles taken as input, in the json_file as output 
def csv_files_to_vis1(csv_dir, json_file, order):
    csv_files = get_files_ending_with("csv", csv_dir, order)
    b = verify_csv_structure_for_multiple_files(csv_files)
    assert b[0]    
    data_matrix = []
    for i in range(len(csv_files)):
        tmp  = [] # all data in the  file number i
        for m in range(1, b[1]):
            row = []
            for n in range(1, b[1]):
                row.append(get_i_j_cell_from_csv(m,n, csv_files[i]))
            tmp.append(row)
        data_matrix.append({"model_name" : os.path.basename(csv_files[i])[:-4],  "model_data": tmp })
    vis1_data = {'visualisation_type': 'vis1', "nb_classes" : b[1] - 1, 'nb_models' : len(csv_files),  'vis_data' : data_matrix}
    with open(json_file, 'w') as json_file:
        json.dump(vis1_data, json_file, indent=4)


#create the visualisation 2/3 for csv_fles taken as input, in the json_file as output 
def csv_files_to_vis2_3(csv_dir, json_file, order, vis_2_or_3):
    csv_files = get_files_ending_with("csv", csv_dir, order)
    b = verify_csv_structure_for_multiple_files(csv_files)
    assert b[0]
    data = {}
    modeles_names = [ os.path.basename(m)[:-4] for m in csv_files]
    for m in range(1, b[1]):
        for n in range(1, b[1]):
            tmp = []
            for i in range(len(csv_files)):
                value_mn = get_i_j_cell_from_csv(m,n , csv_files[i])
                tmp.append(value_mn)
            data["celles-" + f'{m-1}-{n-1}'] = tmp
    vis2_data = {'visualisation_type': vis_2_or_3, "nb_classes" : b[1] - 1, 'nb_models' : len(csv_files) , 'model_names': modeles_names, 'vis_data' : data}
    with open(json_file, 'w') as json_file:
        json.dump(vis2_data, json_file, indent=4)
                        
#create the visualisation 4 for csv_fles taken as input, in the json_file as output 
def csv_files_to_vis4(csv_dir, json_file, order):
    csv_files = get_files_ending_with("csv", csv_dir, order)
    b = verify_csv_structure_for_multiple_files(csv_files)
    assert b[0]
    data = {}
    for m1 in csv_files:
        for m2 in csv_files:
            tmp= []
            if (m1 != m2):
                for i in range(1, b[1]):
                    for j in range(1, b[1]):
                        cmp_value = get_i_j_cell_from_csv(i,j , m1) - get_i_j_cell_from_csv(i,j,m2)
                        if i != j:
                            if cmp_value > 0 :
                                tmp.append({"value" : abs(cmp_value) ,"sign" : "PLUS"}) 
                            elif cmp_value < 0:
                                tmp.append({"value" : abs(cmp_value) ,"sign" : "MINUS"}) 
                            elif cmp_value ==0:
                                tmp.append({"value" : abs(cmp_value) ,"sign" : "NONE"}) 
                        else:
                            if cmp_value > 0 :
                                tmp.append({"value" : abs(cmp_value) ,"sign" : "MINUS"}) 
                            elif cmp_value < 0:
                                tmp.append({"value" : abs(cmp_value),"sign" : "PLUS"}) 
                            elif cmp_value ==0:
                                tmp.append({"value" : abs(cmp_value) ,"sign" : "NONE"}) 
            else :
                for i in range(1, b[1]):
                    for j in range(1, b[1]):
                        cmp_value = get_i_j_cell_from_csv(i,j , m1)
                        tmp.append({"value" : abs(cmp_value) ,"sign" : "NONE"}) 
            data[ os.path.basename(m1)[:-4] + "_cmp_" + os.path.basename(m2)[:-4]] = tmp
    vis4_data = {'visualisation_type': 'vis4', 'nb_classes' : b[1] - 1, 'nb_models' : len(csv_files), 'vis_data' : data}
    with open(json_file, 'w') as json_file:
        json.dump(vis4_data, json_file, indent=4)


#generate the 4 visiualisations json files for csv_dir as input
def generate_json_files(csv_dir,json_folder, order):
    os.makedirs(json_folder, exist_ok=True)
    csv_files_to_vis1(csv_dir,os.path.join(json_folder,  "vis1.json"), order)
    csv_files_to_vis2_3(csv_dir,os.path.join(json_folder, "vis2.json"), order, "vis2")
    csv_files_to_vis2_3(csv_dir,os.path.join(json_folder, "vis3.json"), order, "vis3")
    csv_files_to_vis4(csv_dir,os.path.join(json_folder , "vis4.json"), order)
  
                        
                        



if __name__ == "__main__":  
    import sys
    import time 
    import order_lib
    
    csv_dir = sys.argv[1]
    vis_folder = sys.argv[2]
    
    # generate_json_files(csv_dir,vis_folder, order_lib.sort_with_las)
    # generate_json_files(csv_dir,vis_folder, order_lib.order_matrix)
    generate_json_files(csv_dir,vis_folder, order_lib.order_matrix_reverse)
    
