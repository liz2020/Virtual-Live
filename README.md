# Virtual-Live

Virtual-Live is a desktop program that aims to enable anyone to use a webcam to control live2d characters. This program is developed for Mac, but could be compatible with Windows and Linux after slight modification. 

## Quick Start
See [GETTING_STARTED.md](GETTING_STARTED.md)

## Todo Lists
- Move the prediction logic from src/render/live2d to src/render/detection, so the data send from detection to live2d is just roll, yawn, and pitch instead of facelandmarks. (use factory design pattern)
- use opencv.js's solvePnP function to replace the current hard-coded facelandmark to roll, yawn, pitch function. (need to build opencv.js by myself)
- Implement eye tracking.
- Implement model import