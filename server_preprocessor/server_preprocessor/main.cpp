#pragma once
#include <iostream>
#include "image_processor.h"
#include <string>

bool setParameters(int debug, int argc, char** &argv, std::string &_arg_path,
	int &_color_range, std::string &_is_display_result, int &_color_map, std::string &_arg_morphology,
	std::string &_arg_bitwise_not, int &_erode_range, int &_dilate_range, double &_gamma_value);

//Debug Mood [Set Default Arguments] (1 => true)
const int DEBUG_MODE = 0; 

//Default values
const double DEFAULT_GAMMA_VALUE = 1.10;
const std::string DEFAULT_PATH = "G://Final Year Project Development//Release 03//sample.jpg";
const int DEFAULT_COLOR_RANGE = 15;

//0 - COLORMAP_BONE,
//1 - COLORMAP_HOT,
//2 - COLORMAP_PINK,
//3 - COLORMAP_RAINBOW
const int DEFAULT_COLOR_MAP = 2;

//Fixed Values [Not Arguments]
const std::string DEFAULT_MORPHOLOGY_OPERATION = "0";
const std::string DEFAULT_BITWISE_NOT = "1";
const int DEFAULT_ERODE_RANGE = 1;
const int DEFAULT_DILATE_RANGE = 1;
const std::string DEFAULT_IS_DISPLAY_RESULT = "1";

/*
-------------Arguments-----------------------
[file_name] 
[allow_morphology_operations] 
[bitwise_not]
[color_range]
[erode_size]
[dilate_size]
[display_result]
---------------------------------------------
*/
int main(int argc, char* argv[]) {
	//Parameters
	std::string _arg_path;
	int _color_range;
	std::string _is_display_result;
	int _color_map;
	std::string _arg_morphology;
	std::string _arg_bitwise_not;
	int _erode_range;
	int _dilate_range;
	double _gamma_value;

	//Set Parameters
	bool isSetParameters = setParameters(DEBUG_MODE, argc, argv,
		_arg_path, _color_range, _is_display_result, _color_map, _arg_morphology,
		_arg_bitwise_not, _erode_range, _dilate_range, _gamma_value);

	if (!isSetParameters) {
		std::cout << "Arguments [01]:" << std::endl;
		std::cout << "[file_name]" <<
			" [display_result] [color_map] [color_range] [Gamma (leave blank will set gamma = 1.1)]" << std::endl;
		std::cout << std::endl;
		std::cout << "Arguments [02]:" << std::endl;
		std::cout << "[file_name] [allow_morphology_operations] [bitwise_not]" <<
			" [erode_size] [dilate_size] [display_result] [color_map] [color_range]" <<
			" [Gamma (leave blank will set gamma = 1.1)]" << std::endl;

		//Color Map Help
		std::cout << std::endl;
		std::cout << "0 - COLORMAP_BONE" << std::endl;
		std::cout << "1 - COLORMAP_HOT" << std::endl;
		std::cout << "2 - COLORMAP_PINK" << std::endl;
		std::cout << "3 - COLORMAP_RAINBOW" << std::endl;
		std::cout << "4 - Don't Apply Color Map" << std::endl;
		
		std::cout << std::endl;
		std::cout << (argc - 1)
			<< " number of arguments found!" << "\n";
		std::cout << "All Arguments are required to proceeed!" << std::endl;
	}
	else {
		int color_map[] = { 
			cv::COLORMAP_BONE,
			cv::COLORMAP_HOT,
			cv::COLORMAP_PINK,
			cv::COLORMAP_RAINBOW
		};

		bool allow_morphology = false;
		bool allow_bitwise_not = false;
		bool allow_display_result = false;
		if (_arg_morphology == "1") { allow_morphology = true; }
		if (_arg_bitwise_not == "1") { allow_bitwise_not = true; }
		if (_is_display_result == "1") { allow_display_result = true; }

		//Image processor instance
		image_processor processor;

		cv::Mat image = processor.openImage(_arg_path);
		
		if (_color_map < 4) {
			// Apply the colormap:
			cv::applyColorMap(image, image, color_map[_color_map]);
			//processor.viewImage(image, "Color Map");
		}

		//Set Brightness and contrast automatically
		//processor.setBrighnessContrast(image, image);
		//processor.viewImage(image, "Brightness/Contrast Fixed Image");
		
		//Apply Gamma Correction
		image = processor.applyGammaCorrection(image, _gamma_value);

		//Apply Morphology Operations
		image = processor.erodeImage(image, _erode_range);
		image = processor.dilateImage(image, _dilate_range);

		std::vector<int> color_range_rgb(3);
		color_range_rgb.at(0) = _color_range;
		color_range_rgb.at(1) = _color_range;
		color_range_rgb.at(2) = _color_range;
		cv::Mat threshold_image =
			processor.removeBackground(image, color_range_rgb, allow_bitwise_not);
		
		if (allow_morphology) {
			threshold_image = processor.erodeImage(threshold_image, _erode_range);
			threshold_image = processor.dilateImage(threshold_image, _dilate_range);
		}

		//Configure save file name
		std::string file_name = _arg_path;
		std::string delimiter = ".";
		size_t pos = 0;
		std::string save_file_name;
		while ((pos = file_name.find(delimiter)) != std::string::npos) {
			save_file_name = file_name.substr(0, pos);
			file_name.erase(0, pos + delimiter.length());
		}

		save_file_name = save_file_name + "_processed." + file_name;
		processor.saveImage(threshold_image, save_file_name);

		threshold_image = processor.erodeImage(threshold_image, _erode_range);
		threshold_image = processor.dilateImage(threshold_image, _dilate_range);
		
		if (allow_display_result) {
			processor.viewImage(threshold_image, "Result Image");
		}
	}
}

bool setParameters(int debug, int argc, char** &argv, std::string &_arg_path,
	int &_color_range, std::string &_is_display_result, int &_color_map, std::string &_arg_morphology,
	std::string &_arg_bitwise_not, int &_erode_range, int &_dilate_range, double &_gamma_value) {
	if (debug == 1) {
		//debugging values
		_arg_path = DEFAULT_PATH;
		_color_range = DEFAULT_COLOR_RANGE;
		_is_display_result = DEFAULT_IS_DISPLAY_RESULT;
		_color_map = DEFAULT_COLOR_MAP;
		_arg_morphology = DEFAULT_MORPHOLOGY_OPERATION;
		_arg_bitwise_not = DEFAULT_BITWISE_NOT;
		_erode_range = DEFAULT_ERODE_RANGE;
		_dilate_range = DEFAULT_DILATE_RANGE;
		_gamma_value = DEFAULT_GAMMA_VALUE;
		return true;
	}
	else {
		if (argc < 5) {
			return false;
		}
		else if (argc <= 6) {
			//EXE with least arguments
			_arg_path = argv[1];
			_color_range = atoi(argv[4]);
			_is_display_result = argv[2];
			_color_map = atoi(argv[3]);
			//These values set to default values
			_arg_morphology = DEFAULT_MORPHOLOGY_OPERATION;
			_arg_bitwise_not = DEFAULT_BITWISE_NOT;
			_erode_range = DEFAULT_ERODE_RANGE;
			_dilate_range = DEFAULT_DILATE_RANGE;
			if (argc == 5) { _gamma_value = DEFAULT_GAMMA_VALUE; }
			else { _gamma_value = std::stod(argv[5]); }
			return true;
		}
		else if (argc < 9) {
			return false;
		}
		else if (argc <= 10) {
			//EXE with all arguments
			_arg_path = argv[1];
			_arg_morphology = argv[2];
			_arg_bitwise_not = argv[3];
			_color_range = atoi(argv[8]);
			_color_map = atoi(argv[7]);
			_erode_range = atoi(argv[4]);
			_dilate_range = atoi(argv[5]);
			_is_display_result = argv[6];
			if (argc == 9) { _gamma_value = DEFAULT_GAMMA_VALUE; }
			else { _gamma_value = std::stod(argv[9]); }
			return true;
		}
		else {
			return false;
		}
	}
}