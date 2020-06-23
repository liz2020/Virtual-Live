import {
    resizeResults,
    draw,
    FaceLandmarks,
    FaceLandmarks68,
    FaceDetection,
    Rect,
    Dimensions,
    Point
} from "face-api.js";

export let s_instance: LAppLandmarks = null;

export abstract class LAppLandmarks {
    public static getInstance(type:string): LAppLandmarks {
        if (s_instance != null && s_instance._type === type) {
            return s_instance;
        }

        LAppLandmarks.releaseInstance();
        if(type === "faceLandmark68"){
            s_instance = new LAppFaceLandmarks68(type);
        }
        return s_instance;
    }

    public static releaseInstance(): void {
        if (s_instance != null) {
            s_instance.release();
        }
        s_instance = null;
    }

    constructor(type:string) {
        this._type = type;
    }
  
    public release(): void{};

    public abstract setDetections(detections): void;
    public abstract render(canvas): void;

    /* comment format [min, max] default */
    public abstract getAngleX(): number;       //[-30,30] 0 左右朝向 yaw
    public abstract getAngleY(): number;       //[-30,30] 0 仰头低头 pitch
    public abstract getAngleZ(): number;       //[-30,30] 0 以脖子为轴摇头 roll
    public abstract getEyeLOpen(): number;     //[0,1] 1
    public abstract getEyeROpen(): number;     //[0,1] 1
    public abstract getEyeBallX(): number;     //[-1,1] 0
    public abstract getEyeBallY(): number;     //[-1,1] 0
    public abstract getBodyAngleX(): number;   //[-10,10] 0
    public abstract getMouthOpenY(): number;   //[0,1] 0

    _type: string;
}

export class LAppFaceLandmarks68 extends LAppLandmarks{
    constructor(type:string) {
        super(type);
        this._detections = null;
    }

    setDetections(detections):void{
        this._detections = this.convertJsonToType(detections);
        this._eye_right = this._detections.landmarks.getRightEye()[0];
        this._eye_left = this._detections.landmarks.getLeftEye()[3];
        this._nose = this._detections.landmarks.getNose()[6];
        // this._mouth = this.getMeanPosition(this._detections.landmarks.getMouth());
        this._jaw = this.getMeanPosition(this._detections.landmarks.getJawOutline());
    }

    render(canvas): void{
        canvas.getContext("2d").clearRect(1, 1, canvas.width, canvas.height);
        // canvas.getContext("2d").fillStyle = "black";
        // canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
        const displaySize = { width: canvas.width, height: canvas.height };
        const resizedDetections = resizeResults(this._detections, displaySize);
        draw.drawFaceLandmarks(canvas, resizedDetections);
    }

    private getMeanPosition(l) {
        return l
            .map((a) => [a.x, a.y])
            .reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
            .map((a: number) => a / l.length)
            .reduce((a, b) => new Point(a, b));
    }
    
    public getAngleX(): number{
        if(this._detections == null) {return 0}
        let rawAngle = - (this._eye_left.x + (this._eye_right.x - this._eye_left.x) / 2 - this._nose.x) / this._detections.detection.box.width;
        let normalizedAngle = rawAngle * 10;
        return normalizedAngle;
    };   
        
    public getAngleY(): number{
        if(this._detections == null) {return 0}
        let rawAngle =  -0.26 + (this._jaw.y - this.getMeanPosition([this._eye_left,this._eye_right,this._nose]).y)/ this._detections.detection.box.height;
        let normalizedAngle = rawAngle > 0? rawAngle * 6 : rawAngle * 10;
        return normalizedAngle;
    };       

    public getAngleZ(): number{
        return 0;
    };       
    
    public getEyeLOpen(): number{
        return 0;
    };     

    public getEyeROpen(): number{
        return 0;
    };

    public getEyeBallX(): number{
        return 0;
    };
         
    public getEyeBallY(): number{
        return 0;
    };     

    public getBodyAngleX(): number{
        return 0;
    };   

    public getMouthOpenY(): number{
        return 0;
    };

    convertJsonToType(detections){
        // console.log(detections);
        // unshiftedLandmarks
        let unshiftedLandmarks = detections.unshiftedLandmarks;
        let typedPositions: Point[] = unshiftedLandmarks._positions.map(
        pt => new Point(pt._x, pt._y)
        );
        let typedDim: Dimensions = new Dimensions(
        unshiftedLandmarks._imgDims._width,
        unshiftedLandmarks._imgDims._height
        );
        let typedShift: Point = new Point(
        unshiftedLandmarks._shift._x,
        unshiftedLandmarks._shift._y
        );

        unshiftedLandmarks._positions = typedPositions;
        unshiftedLandmarks._shift = typedShift;
        unshiftedLandmarks._imgDims = typedDim;

        let typedUnshiftedLandmarks: FaceLandmarks = Object.assign(
        new FaceLandmarks68(typedPositions, typedDim, typedShift),
        unshiftedLandmarks
        );
        // console.log(typedUnshiftedLandmarks);
        // landmarks
        let landmarks = detections.landmarks;
        let typedLMPositions: Point[] = landmarks._positions.map(
        pt => new Point(pt._x, pt._y)
        );
        let typedLMDim: Dimensions = new Dimensions(
        landmarks._imgDims._width,
        landmarks._imgDims._height
        );
        let typedLMShift: Point = new Point(
        landmarks._shift._x,
        landmarks._shift._y
        );

        landmarks._positions = typedLMPositions;
        landmarks._shift = typedLMShift;
        landmarks._imgDims = typedLMDim;

        let typedLandmarks: FaceLandmarks = Object.assign(
        new FaceLandmarks68(typedLMPositions, typedLMDim, typedLMShift),
        unshiftedLandmarks
        );
        // console.log(typedLandmarks);
        // detection
        let detection = detections.detection;
        let typedRect: Rect = new Rect(
        detection._box._x,
        detection._box._y,
        detection._box._width,
        detection._box._height
        );
        let typedImageDims = new Dimensions(
        detection._imageDims._width,
        detection._imageDims._height
        );

        detection._box = typedRect;
        detection._imageDims = typedImageDims;

        let typedDetection: FaceDetection = Object.assign(
        new FaceDetection(0, typedRect, typedImageDims),
        detection
        );
        // console.log(typedDetection);

        // alignedRect
        let alignedRect = detections.alignedRect;
        let typedARect: Rect = new Rect(
        alignedRect._box._x,
        alignedRect._box._y,
        alignedRect._box._width,
        alignedRect._box._height
        );
        let typedAImageDims = new Dimensions(
        alignedRect._imageDims._width,
        alignedRect._imageDims._height
        );

        alignedRect._box = typedARect;
        alignedRect._imageDims = typedAImageDims;

        let typedADetection: FaceDetection = Object.assign(
        new FaceDetection(0, typedARect, typedAImageDims),
        alignedRect
        );
        // console.log(typedADetection);

        return {
        unshiftedLandmarks: typedUnshiftedLandmarks,
        landmarks: typedLandmarks,
        detection: typedDetection,
        alignedRect: typedADetection
        };
    }

    _detections;
    _eye_right;
    _eye_left;
    _nose;
    _mouth;
    _jaw;
}