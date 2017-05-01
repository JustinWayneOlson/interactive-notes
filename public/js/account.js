$('#document').ready(function(){
   var max_height = 0;
   $('.well').each(function(index, value){
      height = $(this).height() / $(this).parent().height() * 100
      if(height > max_height)
      {
         max_height = height;
      }
   });
   $('.well').each(function(index, value){
      console.log(max_height);
      $(this).height(max_height + '%');
   });
});
