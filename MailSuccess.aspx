﻿<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="MailSuccess.aspx.vb" Inherits="ByteBazaar.MailSuccess" %>

<!DOCTYPE html>
<html class="no-js" lang="zxx">


<!-- Mirrored from demo.Brycode.com/themes/shopgrids/MailSuccess.aspx by HTTrack Website Copier/3.x [XR&CO'2014], Fri, 02 Feb 2024 12:42:02 GMT -->
<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>Mail Success - ByteBazaar eCommerce</title>
  <meta name="description" content="" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="shortcut icon" type="image/x-icon" href="assets/images/favicon.svg" />

  <!-- ========================= CSS here ========================= -->
  <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
  <link rel="stylesheet" href="assets/css/LineIcons.3.0.css" />
  <link rel="stylesheet" href="assets/css/main.css" />

</head>

<body>
  <!--[if lte IE 9]>
        <p class="browserupgrade">
          You are using an <strong>outdated</strong> browser. Please
          <a href="https://browsehappy.com/">upgrade your browser</a> to improve
          your experience and security.
        </p>
      <![endif]-->

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
  <div class="maill-success">
    <div class="d-table">
      <div class="d-table-cell">
        <div class="container">
          <div class="success-content">
            <i class="lni lni-envelope"></i>
            <h2>Your Mail Sent Successfully</h2>
            <p>Thanks for contacting with us, We will get back to you asap.</p>
            <div class="button">
              <a href="Home.aspx" class="btn">Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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