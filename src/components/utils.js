
function dynamicBBoxImgUrl(originImg, detections) {
    let rootUrl = "http://localhost:5000/processing/"
    let url = rootUrl+originImg;
    let boxes = [];
    for(let i in detections){
        let bxItem = {};
        bxItem['box'] = detections[i].bbox;
        bxItem['type'] = detections[i].deType;
        bxItem['label'] = detections[i].deType;
        boxes.push(bxItem);
    }
    url = url+"?boxes="+JSON.stringify(boxes)
    return url;
}

export {
    dynamicBBoxImgUrl
};