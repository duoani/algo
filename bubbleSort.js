function bubbleSort(arr){
    var count = 0;
    for(var i=0; i<arr.length-1; i++){
        var temp;
        for(var j=i+1; j<arr.length; j++){
            if(arr[i] > arr[j]){
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            count ++;
        }
    }
    console.log(count)
    return arr;
}
var arr = bubbleSort([3,4,1,11,2,76,99,31]);
console.log(arr);
