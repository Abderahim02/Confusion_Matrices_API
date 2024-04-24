import csv
import numpy as np
import matplotlib.pyplot as plt
import numpy as np

def plot_confusion_matrix(confusion_matrix, classes, normalize=False, title=None, cmap=plt.cm.Blues):
    if not title:
        if normalize:
            title = 'Normalized Confusion Matrix'
        else:
            title = 'Confusion Matrix, Without Normalization'
            
    plt.figure(figsize=(8, 8))
    plt.imshow(confusion_matrix, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45)
    plt.yticks(tick_marks, classes)
    if normalize:
        confusion_matrix = confusion_matrix.astype('float') / confusion_matrix.sum(axis=1)[:, np.newaxis]
        
    thresh = confusion_matrix.max() / 2.
    for i in range(confusion_matrix.shape[0]):
        for j in range(confusion_matrix.shape[1]):
            plt.text(j, i, "{:.2f}".format(confusion_matrix[i, j]),
                     horizontalalignment="center",
                     color="white" if confusion_matrix[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')


def save_confusion_matrices(confusion_matrix, classes, model, file_path="res"):
    file_name = file_path + "/cm_" + model+".csv"
    with open(file_name, mode='w') as file:
        writer = csv.writer(file, delimiter=',')
        writer.writerow(['Class'] + classes)
        for i in range(len(classes)):
            normalized_row = [classes[i]] + list(confusion_matrix[i, :])
            writer.writerow(normalized_row)

    print(f"Confusion matrices saved to {file_name}")