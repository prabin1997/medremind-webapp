const msg = ["Diabetes is not terrible and there are many things you can do to prevent problems from diabetes, such as monitoring blood glucose, watching your diet, keeping fit, and taking pills regularly.",
"Try brisk walking – a convenient, safe and cost-effective way of exercising! It’s good for your heart and will help control blood glucose.",
"Taking diabetes medications or injecting insulin regularly can help control your blood glucose level.",
"Afraid of testing blood glucose because it hurts? Try to test on the sides of your fingertips or rotate your fingers, which can help to minimise pain.",
"The effect of regular activity is also known to help increase insulin sensitivity, which can be useful for all types of diabetes, particularly type 2 diabetes.",
"Taking the time to draw up a meal plan can save you time and stress in the long run. Eating meals on a schedule can help keep your blood sugar levels where they need to be.",
"Diabetics need to watch what they eat to prevent spikes in their blood sugar, but that doesn’t mean they have to avoid food they love."
];
const randomMsg = msg[Math.floor(Math.random() * msg.length)];

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

  $("#subBtn").click(function(){
    const msg = ["Diabetes is not terrible and there are many things you can do to prevent problems from diabetes, such as monitoring blood glucose, watching your diet, keeping fit, and taking pills regularly.",
    "Try brisk walking – a convenient, safe and cost-effective way of exercising! It’s good for your heart and will help control blood glucose.",
    "Taking diabetes medications or injecting insulin regularly can help control your blood glucose level.",
    "Afraid of testing blood glucose because it hurts? Try to test on the sides of your fingertips or rotate your fingers, which can help to minimise pain.",
    "The effect of regular activity is also known to help increase insulin sensitivity, which can be useful for all types of diabetes, particularly type 2 diabetes.",
    "Taking the time to draw up a meal plan can save you time and stress in the long run. Eating meals on a schedule can help keep your blood sugar levels where they need to be.",
    "Diabetics need to watch what they eat to prevent spikes in their blood sugar, but that doesn’t mean they have to avoid food they love."
    ];
    const randomMsg = msg[Math.floor(Math.random() * msg.length)];
    Swal.fire(
        'Sucess',
         randomMsg
        );
    });

