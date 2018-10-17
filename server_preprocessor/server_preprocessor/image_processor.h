#pragma once
#include <opencv2/imgcodecs.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <vector>
#include <fstream>

class image_processor
{
public:
	/*Element [_morph_elem]:
			0: Rect, 
			1 : Cross, 
			2 : Ellipse
	  Operator:
			0: Opening, 
			1: Closing, 
			2: Gradient, 
			3: Top Hat, 
			4: Black Hat*/
	cv::Mat applyMorphology(
		int _morph_elem, int _morph_size, int _morph_operator, cv::Mat image);

	/* 0: Binary [CV_THRESH_BINARY]
	1: Binary Inverted
	2: Threshold Truncated
	3: Threshold to Zero
	4: Threshold to Zero Inverted*/
	cv::Mat applyThreshold(int _type, int _value, cv::Mat image);

	cv::Mat erodeImage(cv::Mat _image, int _erode_sz); 
	cv::Mat dilateImage(cv::Mat _image, int _dilate_sz);

	cv::Mat openImage(std::string filename);
	cv::Size getCustomResolution(cv::Mat image, int _height);
	void viewImage(cv::Mat _image, std::string _title);
	cv::Mat removeBackground(cv::Mat _image,
		std::vector<int> _color_range, bool _is_bitwise_not);

	void saveImage(cv::Mat _image, std::string path);
	cv::Mat applyGammaCorrection(cv::Mat image, double _gamma);
	void setBrighnessContrast(const cv::Mat &src, cv::Mat &dst);
};

