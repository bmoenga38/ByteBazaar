<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="404.aspx.vb" Inherits="ByteBazaar._404" %>

<!DOCTYPE html>
<html class="no-js" lang="zxx">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>404 Error - ShopGrids Bootstrap 5 eCommerce HTML Template.</title>
  <meta name="description" content="" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.svg" />

  <!-- ========================= CSS here ========================= -->
  <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
  <link rel="stylesheet" href="assets/css/LineIcons.3.0.css" />
  <link rel="stylesheet" href="assets/css/main.css" />

</head>

<body>

  <!-- Preloader -->
  <div class="preloader">
    <div class="preloader-inner">
      <div class="preloader-icon">
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
  <!-- /End Preloader -->

  <!-- Start Error Area -->
  <!-- <div class="error-area">
    <div class="d-table">
      <div class="d-table-cell">
        <div class="container">
          <div class="error-content">
            <h1>404</h1>
            <h2>Oops! Page Not Found!</h2>
            <p>The page you are looking for does not exist. It might have been moved or deleted.</p>
            <div class="button">
              <a href="Home.aspx" class="btn">Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->

    <section class="page_404">
        <div class="container">
            <div class="row">
                <div class="col-sm-12 ">
                    <div class="col-sm-10 col-sm-offset-1  text-center">
                        <div class="four_zero_four_bg">
                            <h1 class="text-center ">404</h1>
                        </div>
                        
                        <div class="contant_box_404">
                            <h3 class="h2">Oopsy!
                            </h3>

                            <p>the page you are looking for not avaible!</p>
                            <a href="Home.aspx" class="link_404">Go Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  <!-- End Error Area -->

  <!-- ========================= JS here ========================= -->
  <script src="assets/js/bootstrap.min.js"></script>
  <script>
    window.onload = function () {
      window.setTimeout(fadeout, 500);
    }

    function fadeout() {
      document.querySelector('.preloader').style.opacity = '0';
      document.querySelector('.preloader').style.display = 'none';
    }
  </script>
</body>

</html>