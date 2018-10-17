#include "image_processor.h"

cv::Mat image_processor::applyGammaCorrection(cv::Mat image, double _gamma) {
	try {
		cv::Mat lookUpTable(1, 256, CV_8U);
		uchar* p = lookUpTable.ptr();
		for (int i = 0; i < 256; ++i)
			p[i] = cv::saturate_cast<uchar>(pow(i / 255.0, _gamma) * 255.0);
		cv::Mat res = image.clone();
		cv::LUT(image, lookUpTable, res);
		return res;
	}
	catch (std::exception& ex) {
		printf("Error: image_processor::applyGammaCorrection(cv::Mat image, double _gamma) method\n");
		printf(ex.what());
	}
}

void image_processor::saveImage(cv::Mat _image, std::string path) {
	std::ifstream file(path.c_str());
	if (file.good()) {
		std::string message = path + " already exist in the destination. not saved";
		printf(message.c_str());
		file.close();
	}
	else {
		file.close();
		cv::imwrite(path, _image);
	}
}

cv::Mat image_processor::applyMorphology(
	int _morph_elem, int _morph_size, int _morph_operator, cv::Mat image) {
	try {
		//Element [_morph_elem]:
		//0: Rect, 1 : Cross, 2 : Ellipse
		//Operator [_morph_operator]:
		//0: Opening, 1: Closing, 2: Gradient, 3: Top Hat, 4: Black Hat
		int const max_operator = 4;
		int const max_elem = 2;
		int const max_kernel_size = 21;

		// Since MORPH_X : 2,3,4,5 and 6
		int operation = _morph_operator + 2;

		//calculate kernel (2n+1)
		int kernel = 2 * _morph_size + 1;
		cv::Mat element = getStructuringElement(_morph_elem,
			cv::Size(kernel, kernel), cv::Point(_morph_size, _morph_size));

		// Apply the specified morphology operation
		cv::morphologyEx(image, image, operation, element);

		//return
		return image;
	}
	catch (std::exception& ex) {
		printf("Error: image_processor::applyMorphology(int _morph_elem, int _morph_size, int _morph_operator, cv::Mat image) method\n");
		printf(ex.what());
	}
}

cv::Mat image_processor::dilateImage(cv::Mat _image, int _dilate_sz) {
	//calculate kernel (2n+1)
	int kernel = 2 * _dilate_sz + 1;

	cv::Mat element = cv::getStructuringElement(cv::MORPH_ELLIPSE,
		cv::Size(kernel, kernel),
		cv::Point(_dilate_sz, _dilate_sz));

	cv::dilate(_image, _image, element);
	return _image;
}

cv::Mat image_processor::erodeImage(cv::Mat _image, int _erode_sz) {
	//calculate kernel (2n+1)
	int kernel = 2 * _erode_sz + 1;

	cv::Mat element = cv::getStructuringElement(cv::MORPH_ELLIPSE,
		cv::Size(kernel, kernel),
		cv::Point(_erode_sz, _erode_sz));

	cv::erode(_image, _image, element);
	return _image;
}

cv::Mat image_processor::removeBackground(cv::Mat _image, 
						std::vector<int> _color_range, bool _is_bitwise_not) {
	//Calculate the image px count
	signed long long int _px_count = (_image.cols * _image.rows);
	signed long long int _px_r = 0, _px_b = 0, _px_g = 0;
	for (int x = 0; x < _image.cols; x++) {
		for (int y = 0; y < _image.rows; y++) {
			_px_r += _image.at<cv::Vec3b>(y, x)[0];
			_px_b += _image.at<cv::Vec3b>(y, x)[1];
			_px_g += _image.at<cv::Vec3b>(y, x)[2];
		}
	}
	int _avg_px_r = _px_r / _px_count;
	int _avg_px_b = _px_b / _px_count;
	int _avg_px_g = _px_g / _px_count;

	//Lower range compared to average pixels
	int _px_r_lower_range = _avg_px_r - (_color_range.at(0) / 2);
	int _px_b_lower_range = _avg_px_b - (_color_range.at(1) / 2);
	int _px_g_lower_range = _avg_px_g - (_color_range.at(2) / 2);

	//Upper range compared to average pixels
	int _px_r_upper_range = _avg_px_r + (_color_range.at(0) / 2);
	int _px_b_upper_range = _avg_px_b + (_color_range.at(1) / 2);
	int _px_g_upper_range = _avg_px_g + (_color_range.at(2) / 2);

	cv::Mat threshold_image;
	cv::inRange(_image, 
		cv::Scalar(_px_r_lower_range, _px_b_lower_range, _px_g_lower_range),
		cv::Scalar(_px_r_upper_range, _px_b_upper_range, _px_g_upper_range),
		threshold_image);

	if (_is_bitwise_not) {
		cv::bitwise_not(threshold_image, threshold_image);
	}

	//Blur the image
	cv::blur(threshold_image, threshold_image, cv::Size(3, 3));

	return threshold_image;
}

void image_processor::viewImage(cv::Mat _image, std::string _title) {
	try{
		const char * _title_chr = _title.c_str();
		cvNamedWindow(_title_chr, CV_WINDOW_AUTOSIZE);
		cv::imshow(_title_chr, _image);
		cvWaitKey(0);
	}
catch (std::exception& ex) {
	printf("Error: image_processor::viewImage(cv::Mat _image, std::string _title) method\n");
	printf(ex.what());
}
}

cv::Mat image_processor::openImage(std::string filename)
{
	cv::Mat image;
	image = imread(filename, cv::IMREAD_COLOR);

	if (image.empty())
	{
		printf("Error: image_processor::openImage(std::string filename) method\n");
		const char * filename_chr = filename.c_str();
		printf("File path:\n");
		printf(filename_chr);
		return image;
	}

	return image;
}

cv::Size image_processor::getCustomResolution(cv::Mat image, int _height)
{
	int picHight = image.size().height;
	int picWidth = image.size().width;

	//Use 400 for editing purposes
	int newHight = _height;		
	int newWidth = (picWidth * newHight) / picHight;
	if (newWidth < 280) { newWidth = 280; }
	cv::Size size(newWidth, newHight);
	return size;
}

cv::Mat image_processor::applyThreshold(int _type, int _value, cv::Mat image) {
	try {
		int threshold_value = _value;
		int threshold_type = _type;
		int const max_value = 255;
		int const max_type = 4;
		int const max_BINARY_value = 255;

		cv::cvtColor(image, image, cv::COLOR_BGR2GRAY);

		/* 0: Binary [CV_THRESH_BINARY]
		1: Binary Inverted
		2: Threshold Truncated
		3: Threshold to Zero
		4: Threshold to Zero Inverted
		*/

		threshold(image, image, threshold_value, max_BINARY_value, threshold_type);

		//adaptiveThreshold(src, dst, maxValue, adaptiveMethod, thresholdType, blockSize, C);
		//cv::adaptiveThreshold(image, image, max_value, cv::ADAPTIVE_THRESH_GAUSSIAN_C, threshold_type, 20, 2);

		cvtColor(image, image, cv::COLOR_GRAY2RGB);

		//If want to resize the image for the original ratio
		//Weight will be automatically calculated using height
		//resize(image, image, getCustomResolution(image, 400));

		return image;
	}
	catch (std::exception& ex) {
		printf("Error: image_processor::applyThreshold(int _type, int _value, cv::Mat image) method\n");
		printf(ex.what());
	}
}

void image_processor::setBrighnessContrast(const cv::Mat &src, cv::Mat &dst)
{
	int histSize = 256;
	float alpha, beta;
	double minGray = 0, maxGray = 0;

	//to calculate grayscale histogram
	cv::Mat gray;
	if (src.type() == CV_8UC1) gray = src;
	else if (src.type() == CV_8UC3) cvtColor(src, gray, CV_BGR2GRAY);
	else if (src.type() == CV_8UC4) cvtColor(src, gray, CV_BGRA2GRAY);
	
	// keep full available range
	cv::minMaxLoc(gray, &minGray, &maxGray);
	
	// current range
	float inputRange = maxGray - minGray;

	// alpha expands current range to histsize range
	alpha = (histSize - 1) / inputRange;   

	// beta shifts current range so that minGray will go to 0
	beta = -minGray * alpha;             

	// Apply brightness and contrast normalization
	// convertTo operates with saurate_cast									 
	src.convertTo(dst, -1, alpha, beta);

	// restore alpha channel from source 
	if (dst.type() == CV_8UC4)
	{
		int from_to[] = { 3, 3 };
		cv::mixChannels(&src, 4, &dst, 1, from_to, 1);
	}
	return;
}