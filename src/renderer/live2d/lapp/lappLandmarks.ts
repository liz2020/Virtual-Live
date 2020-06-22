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

    _type: string;
}

export class LAppFaceLandmarks68 extends LAppLandmarks{
    constructor(type:string) {
        super(type);
    }

    setDetections(detections):void{
        this._detections = this.convertJsonToType(detections);
    }

    render(canvas): void{
        canvas.getContext("2d").clearRect(1, 1, canvas.width, canvas.height);
        // canvas.getContext("2d").fillStyle = "black";
        // canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);
        const displaySize = { width: canvas.width, height: canvas.height };
        const resizedDetections = resizeResults(this._detections, displaySize);
        draw.drawFaceLandmarks(canvas, resizedDetections);
    }

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
}