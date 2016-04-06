!function(window){
    var algo = algo || {};
    var operation = {
        REMOVE_ORIGIN: 0, //从源数组删除
        INSERT_ORIGIN: 1, //在源数组插入
        UPDATE_ORIGIN: 2, //更新数组元素
        SWAP_ORIGIN: 3,   //在源数组交换位置
        REMOVE: 4,        //删除
        INSERT: 5,        //插入
        SWAP: 6,          //交换位置
        COMPARE: 7,       //对比操作(判断条件)
        HIT: 8,           //命中(判断条件达成)
        COMPLETE: 9,      //完成(算法完成)
        SET_GUARD: 10,     //设置哨兵(清除其他哨兵)
        ADD_GUARD: 11,    //添加哨兵(允许添加多个哨兵)
        CHANGE_GUARD: 12, //更换哨兵(移动哨兵)
        CLEAR_GUARD: 13   //清除所有哨兵
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
        updateOrigin: function(i, value, log){
            this.frames.push([operation.UPDATE_ORIGIN, i, value, log]);
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
        setGuard: function(i, log){
            this.frames.push([operation.SET_GUARD, i, log]);
        },
        addGuard: function(i, log){
            this.frames.push([operation.ADD_GUARD, i, log]);
        },
        changeGuard: function(from, to, log){
            this.frames.push([operation.CHANGE_GUARD, from, to, log]);
        },
        clearGuard: function(log){
            this.frames.push([operation.CLEAR_GUARD, log]);
        },
        reset: function(){
            this.frameIndex = 0;
            this.frames = [];
            this.origin = [];
            this.input = [];
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
                    this.input[args[0]] = args[1];
                    this.view.render(this.input);
                    this.view.updateOrigin(args);
                    break;
                case 3:
                    var temp = this.input[args[0]];
                    this.input[args[0]] = this.input[args[1]];
                    this.input[args[1]] = temp;
                    this.view.render(this.input);
                    this.view.swapOrigin(args);
                    break;
                case 4:
                    this.view.remove(args);
                    break;
                case 5:
                    this.view.insert(args);
                    break;
                case 6:
                    this.view.swap(args);
                    break;
                case 7:
                    this.view.compare(args);
                    break;
                case 8:
                    this.view.hit(args);
                    break;
                case 9:
                    this.view.complete(args);
                    break;
                case 10:
                    this.view.setGuard(args);
                    this.view.render(this.input);
                    break;
                case 11:
                    this.view.addGuard(args);
                    this.view.render(this.input);
                    break;
                case 12:
                    this.view.changeGuard(args);
                    this.view.render(this.input);
                    break;
                case 13:
                    this.view.clearGuard(args);
                    this.view.render(this.input);
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
        this.guardIndex = [];
    };
    DefaultView.prototype = {
        render: function(data){
            var html = '';
            for(var i=0, len=data.length; i<len; i++){
                html += '<li class="'+(this.guardIndex[i] ? 'guard' : '')+'"><span>'+data[i]+'</span><em class="g">-></em><em class="t">-></em></li>';
            }
            $('#args').html(html);
        },
        reset: function(data){
            this.logIndex = 0;
            this.guardIndex = [];
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
        updateOrigin: function(args){
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
            $('#args').children('li').removeClass('hit').removeClass('active').removeClass('guard');
        },
        setGuard: function(args){
            this.log(args[1]);
            this.guardIndex = [];
            this.guardIndex[args[0]] = 1;
        },
        addGuard: function(args){
            this.log(args[1]);
            this.guardIndex[args[0]] = 1;
        },
        changeGuard: function(args){
            this.log(args[2]);
            this.guardIndex[args[0]] = undefined;
            this.guardIndex[args[1]] = 1;
        },
        clearGuard: function(args){
            this.log(args[0]);
            this.guardIndex = [];
        }
    };

    window.algo = new Algo();
}(this);
