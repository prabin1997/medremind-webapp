document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // add recipe form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
  });

  $(document).ready(function(){
    $('#modal1').modal();
    });
  
  $(document).ready(function(){
    $('#modal2').modal();
    });
  
  $(document).ready(function(){
    $('#modal3').modal();
    });
  
  $(document).ready(function(){
    $('#modal4').modal();
    });

  $(document).ready(function(){
    $('#modal5').modal();
    });


