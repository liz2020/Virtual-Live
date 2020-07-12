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

    protected getMeanPosition(l) {
        return l
            .map((a) => [a.x, a.y])
            .reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
            .map((a: number) => a / l.length)
            .reduce((a, b) => new Point(a, b));
    }

    protected getDistance(Point1,Point2){
        return Math.sqrt( (Point1.x-Point2.x)* (Point1.x-Point2.x) + (Point1.y-Point2.y)*(Point1.y-Point2.y));
    }

    public abstract setDetections(detections): void;
    public abstract render(canvas): void;

    /* 
    * Parameter format "[min, max] default".
    */
    public abstract getAngleX(): number;       //[-1,1] 0 左右朝向 yaw
    public abstract getAngleY(): number;       //[-1,1] 0 仰头低头 pitch
    public abstract getAngleZ(): number;       //[-1,1] 0 以脖子为轴摇头 roll
    public abstract getEyeBallX(): number;     //[-1,1] 0
    public abstract getEyeBallY(): number;     //[-1,1] 0
    public abstract getBodyAngleX(): number;   //[-1,1] 0
    public abstract getMouthForm(): number;    //[-1,1] 0

    public abstract getMouthOpenY(): number;   //[0,1] 0
    public abstract getEyeLOpen(): number;     //[0,1] 1
    public abstract getEyeROpen(): number;     //[0,1] 1

    _type: string;
}

export class LAppFaceLandmarks68 extends LAppLandmarks{
    constructor(type:string) {
        super(type);
        this._detections = null;
    }

    setDetections(detections):void{
        this._detections = this.plainToClass(detections);
        this._eye_right = this._detections.landmarks.getRightEye()[0];
        this._eye_left = this._detections.landmarks.getLeftEye()[3];
        this._nose = this._detections.landmarks.getNose()[6];
        this._mouth_left = this._detections.landmarks.getMouth()[0];
        this._mouth_right = this._detections.landmarks.getMouth()[6];
        this._lip_top = this._detections.landmarks.getMouth()[14];
        this._lip_bottom = this._detections.landmarks.getMouth()[17];
        this._jaw = this.getMeanPosition(this._detections.landmarks.getJawOutline());
    }

    render(canvas): void{
        canvas.getContext("2d").clearRect(1, 1, canvas.width, canvas.height);
        // canvas.getContext("2d").fillStyle = "black";
        // canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
        const displaySize = { width: canvas.width, height: canvas.height };
        const resizedDetections = resizeResults(this._detections, displaySize);
        // draw.drawDetections(canvas, resizedDetections);
        draw.drawFaceLandmarks(canvas, resizedDetections);
    }
    
    public getAngleX(): number{
        if(this._detections == null) {return 0}
        let rawAngle =  this.getDistance(this._eye_left,this._nose) / this.getDistance(this._eye_right,this._nose)
        let normalizedAngle = (rawAngle -1)*8;
        // console.log("X",normalizedAngle)
        return normalizedAngle;
    };         

    public getAngleY(): number{
        if(this._detections == null) {return 0}
        let rawAngle = -0.25 + this.getDistance(this._jaw , this.getMeanPosition([this._eye_left,this._eye_right,this._nose]))/ this._detections.detection.box.height;
        let normalizedAngle = rawAngle > 0? rawAngle * 6 : rawAngle * 10;
        // console.log("Y",normalizedAngle)
        return normalizedAngle;
    }; 


    public getAngleZ(): number{
        if(this._detections == null) {return 0}
        let rawAngle = (this._mouth_right.y - this._mouth_left.y) /(this._mouth_right.x - this._mouth_left.x)
        // console.log("Z",rawAngle)
        return rawAngle;
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
        if(this._detections == null) {return 0}
        let rawAngle = 3*(-0.15 + this.getDistance(this._lip_top,this._lip_bottom) / this.getDistance(this._mouth_left,this._mouth_right));
        return rawAngle > 1 ? 1 : rawAngle;
    };

    public getMouthForm(): number{
        if(this._detections == null) {return 0}
        let rawAngle = this.getDistance(this._mouth_left,this._mouth_right)/this.getDistance(this._eye_left,this._eye_right);
        let normalizedAngle = 4*(rawAngle-1.2)
        return normalizedAngle;
    }

    plainToClass(detections){
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
    _mouth_left;
    _mouth_right;
    _jaw;
    _lip_top;
    _lip_bottom;
}