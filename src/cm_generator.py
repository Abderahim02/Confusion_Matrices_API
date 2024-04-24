from sklearn.datasets import make_classification
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import train_test_split
from cm_fonctions import save_confusion_matrices
import numpy as np
import os
import random
import string


model_names = [
    "Abjure", "Future", "Picnic",
    "Agonistic", "Garland", "Protect",
    "Airline", "Gigantic", "Publish",
    "Bandit", "Goofy", "Quadrangle",
    "Banquet", "Government", "Recount",
    "Binoculars", "Grandnieces", "Redoubtable",
    "Biologist", "Handbook", "Reflection",
    "Blackboard", "Himself", "Reporter",
    "Board", "Indulge", "Ring",
    "Bookworm", "Inflatable", "Salesclerk",
    "Butterscotch", "Inimical", "Snapshot",
    "Camera", "Interim", "Shellfish",
    "Campus", "Invest", "Ship",
    "Catfish", "Jackpot", "Significance",
    "Carsick", "Kitchenette", "Sometimes",
    "Celebrate", "Law", "Sublime",
    "Celery", "Life", "Tabletop",
    "Citizen", "Lifeline", "Teamwork",
    "Coloring", "Love", "Tennis",
    "Compact", "Magnificent", "Timesaving",
    "Dark", "Malevolence", "Tree",
    "Damage", "Man", "Termination",
    "Dangerous", "Mascot", "Underestimate",
    "Decorum", "Marshmallow", "Vineyard",
    "Endorse", "Mine", "War",
    "Engender", "Moonwalk", "Way",
    "Erratic", "Near", "Wealth",
    "Envelope", "Nephogram", "Wednesday",
    "Etymology", "Newborn", "World",
    "Eyewitness", "Noisome", "Xerox",
    "Eulogy", "Owl", "You",
    "Fish", "Parenthesis", "Zestful",
    "Food", "Perpetrator",
    "Foreclose", "Phone"
]




classes_no = [5,10,20,50]
models = [SVC,LogisticRegression,KNeighborsClassifier,DecisionTreeClassifier,AdaBoostClassifier,MLPClassifier]

for no_classe in classes_no:
    random_class_names = random.sample(model_names, no_classe)
    
    x,y = make_classification(n_samples=10000,n_classes=no_classe,n_informative=7)
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.25)
    if not os.path.isdir("res/classe_"+str(no_classe)):
        os.mkdir("res/classe_"+str(no_classe))
    for model in models:

        model = model()
        model.fit(x_train,y_train)
        preds = model.predict(x_test)

        mat = confusion_matrix(y_test,preds,normalize='true')
        print(random_class_names)
        save_confusion_matrices(np.around(mat, decimals=3),random_class_names,str(model)[:-2]+str(no_classe),"res/classe_"+str(no_classe))

