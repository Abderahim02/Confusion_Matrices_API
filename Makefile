.PHONY: all csv json clean website
all: csv json website

csv:
	python3 src/cm_generator.py

json:
	python3 src/csv_to_json.py res/classe_5 res/all_vis/json_5_models_6_classifiers
	python3 src/csv_to_json.py res/classe_10 res/all_vis/json_10_models_6_classifiers
	python3 src/csv_to_json.py res/classe_20 res/all_vis/json_20_models_6_classifiers
	python3 src/csv_to_json.py res/classe_50 res/all_vis/json_50_models_6_classifiers

website:
	python3 -m http.server 5555

clean :
	rm -rf res/all_vis
