!function(window){
    var algo = algo || {};
    var operation = {
        REMOVE_ORIGIN: 0,
        INSERT_ORIGIN: 1,
        SWAP_ORIGIN: 2,
        REMOVE: 3,
        INSERT: 4,
        SWAP: 5,
        COMPARE: 6,
        HIT: 7,
        COMPLETE: 8
    };

    var Algo = function(view){
        this.view = view || new DefaultView();
        this.frameIndex = 0;
        this.frames = [];
        this.origin = [];
        this.input = [];
    };
    Algo.prototype = {
        removeOrigin: function(index, log){
            this.frames.push([operation.REMOVE_ORIGIN, index, log]);
        },
        swapOrigin: function(from, to, log){
            this.frames.push([operation.SWAP_ORIGIN, from, to, log]);
        },
        insertOrigin: function(after, value, log){
            this.frames.push([operation.INSERT_ORIGIN, after, value, log]);
        },
        remove: function(index, log){
            this.frames.push([operation.REMOVE, index, log]);
        },
        swap: function(from, to, log){
            this.frames.push([operation.SWAP, from, to, log]);
        },
        insert: function(after, value, log){
            this.frames.push([operation.INSERT, after, value, log]);
        },
        compare: function(t1, t2, log){
            this.frames.push([operation.COMPARE, t1, t2, log]);
        },
        hit: function(t1, t2, log){
            this.frames.push([operation.HIT, t1, t2, log]);
        },
        start: function(inputData){
            this.origin = inputData.slice(0);
            this.input = inputData.slice(0);
            this.view.render(this.input);
        },
        complete: function(log){
            this.frames.push([operation.COMPLETE, log]);
        },

        resetPlay: function(){
            this.frameIndex = 0;
            this.input = this.origin.slice(0);
            this.view.reset(this.input);
        },
        next: function(){
            if(this.frameIndex >= this.frames.length){
                return;
            }
            var frame = this.frames[this.frameIndex],
                args = frame.slice(1);

            switch(frame[0]){
                case 0:
                    this.input.splice(args[0], 1);
                    this.view.render(this.input);
                    this.view.removeOrigin(args);
                    break;
                case 1:
                    this.input.splice(args[0], 0, args[1]);
                    this.view.render(this.input);
                    this.view.insertOrigin(args);
                    break;
                case 2:
                    var temp = this.input[args[0]];
                    this.input[args[0]] = this.input[args[1]];
                    this.input[args[1]] = temp;
                    this.view.render(this.input);
                    this.view.swapOrigin(args);
                    break;
                case 3:
                    this.view.remove(args);
                    break;
                case 4:
                    this.view.insert(args);
                    break;
                case 5:
                    this.view.swap(args);
                    break;
                case 6:
                    this.view.compare(args);
                    break;
                case 7:
                    this.view.hit(args);
                    break;
                case 8:
                    this.view.complete(args);
                    break;
            }
            this.frameIndex++;
        },
        getInstance: function(view){
            return new Algo(view);
        }
    };

    var DefaultView = function(){
        this.logIndex = 0;
    };
    DefaultView.prototype = {
        render: function(data){
            var html = '';
            for(var i=0, len=data.length; i<len; i++){
                html += '<li><span>'+data[i]+'</span><em>-></em></li>';
            }
            $('#args').html(html);
        },
        reset: function(data){
            this.logIndex = 0;
            this.render(data);
            $('#log').html('');
        },
        removeOrigin: function(args){
            this.log(args[1]);
        },
        swapOrigin: function(args){
            $('#args').children('li').eq(args[0]).addClass('active').end().eq(args[1]).addClass('active');
            this.log(args[2]);
        },
        insertOrigin: function(args){
            this.log(args[2]);
        },
        compare: function(args){
            $('#args').children('li').removeClass('active')
                .eq(args[0]).addClass('active').end().eq(args[1]).addClass('active');
            this.log(args[2]);
        },
        hit: function(args){
            $('#args').children('li').removeClass('hit')
                .eq(args[0]).addClass('hit');
            this.log(args[1]);
        },
        log: function(msg){
            this.logIndex++;
            msg && $('#log').prepend('<li><span>'+msg+'</span><i>'+this.logIndex+'.</i><li>');
        },
        complete: function(args){
            this.log(args[0]);
            $('#args').children('li').removeClass('hit').removeClass('active');
        }
    };

    window.algo = new Algo();
}(this);

$('#btnRun').on('click', function(){
    var code = $('#code').val();
    eval(code);
    algo.resetPlay();
});
$('#btnReset').on('click', function(){
    algo.resetPlay();
});
$('#btnNext').on('click', function(){
    algo.next();
});

function bubbleSort(arr){
    algo.start(arr);
    for(var i=0; i<arr.length-1; i++){
        var temp;
        for(var j=i+1; j<arr.length; j++){
            algo.compare(i, j, "对比'"+arr[i]+"'与'"+arr[j]+"'");
            if(arr[i] > arr[j]){
                algo.hit(j, "'"+arr[i]+"' > '"+arr[j]+"'，命中");
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                algo.swapOrigin(i, j, "交换位置");
            }
        }
    }
    algo.complete("排序完成");
    return arr;
}
//bubbleSort([281,77,122,11,2,76,99,31]);
