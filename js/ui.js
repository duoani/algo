$('#btnRun').on('click', function(){
    var code = $('#code').val();
    algo.resetPlay();
    algo.reset();
    eval(code);
    $('#player').show();
});
$('#btnReset').on('click', function(){
    algo.resetPlay();
});
$('#btnNext').on('click', function(){
    algo.next();
});
