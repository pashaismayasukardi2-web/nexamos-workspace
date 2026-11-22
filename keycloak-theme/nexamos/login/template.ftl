<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<html class="${properties.kcHtmlClass!}"<#if realm.internationalizationEnabled> lang="${locale.currentLanguageTag}"</#if>>

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <script src="${url.resourcesPath}/js/menu-button-links.js" type="module"></script>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if authenticationSession??>
        <script type="module">
            import { checkCookiesAndSetTimer } from "${url.resourcesPath}/js/authChecker.js";

            checkCookiesAndSetTimer(
              "${authenticationSession.authSessionId}",
              "${authenticationSession.tabId}",
              "${url.ssoLoginInOtherTabsUrl?no_esc}"
            );
        </script>
    </#if>

    <!-- NexaMOS Built-in Self-Contained Stylesheet (Immune to External Caching & PatternFly Conflicts) -->
    <style>
      :root {
        --nexa-bg: #020617;
        --nexa-card-bg: rgba(15, 23, 42, 0.90);
        --nexa-card-border: rgba(51, 65, 85, 0.75);
        --nexa-input-bg: rgba(2, 6, 23, 0.85);
        --nexa-input-border: #1e293b;
        --nexa-input-focus: #6366f1;
        --nexa-text-main: #f8fafc;
        --nexa-text-secondary: #cbd5e1;
        --nexa-text-muted: #94a3b8;
        --nexa-accent: #818cf8;
        --nexa-accent-hover: #a5b4fc;
      }

      html, html.login-pf, .login-pf body, body.nexamos-body {
        background: var(--nexa-bg) !important;
        background-image: none !important;
        color: var(--nexa-text-main) !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 100vh !important;
        min-height: 100vh !important;
        overflow: hidden !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
      }

      /* Ambient decorative glow background */
      .nexamos-bg-orbs {
        position: fixed;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }

      .nexamos-orb {
        position: absolute;
        border-radius: 9999px;
        filter: blur(90px);
        opacity: 0.5;
      }

      .nexamos-orb-1 {
        top: -100px;
        left: -100px;
        width: 380px;
        height: 380px;
        background: radial-gradient(circle, rgba(79, 70, 229, 0.28) 0%, rgba(79, 70, 229, 0) 70%);
      }

      .nexamos-orb-2 {
        bottom: -120px;
        right: -100px;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(168, 85, 247, 0) 70%);
      }

      .nexamos-orb-3 {
        top: 50%;
        left: 45%;
        transform: translate(-50%, -50%);
        width: 460px;
        height: 460px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 70%);
      }

      /* Viewport Center: Fit dalam 100vh tanpa scroll vertikal */
      .nexamos-page-viewport {
        position: relative;
        z-index: 1;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px 24px;
        box-sizing: border-box;
      }

      .nexamos-layout-container {
        width: 100%;
        max-width: 960px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 14px;
        box-sizing: border-box;
      }

      /* ROW 1: 2 Kolom Seimbang */
      .nexamos-row-main {
        display: grid !important;
        grid-template-columns: 1.05fr 1fr !important;
        gap: 64px !important;
        align-items: center !important;
        width: 100% !important;
      }

      /* Kolom Kiri: Branding & Keterangan */
      .nexamos-col-brand {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: flex-start !important;
        text-align: left !important;
      }

      .nexamos-brand-wrapper {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        text-align: left !important;
        gap: 12px !important;
        width: 100% !important;
      }

      .nexamos-brand-logo-link {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        align-self: flex-start !important;
        text-decoration: none !important;
        margin: 0 !important;
        padding: 0 !important;
        transition: opacity 0.15s ease, transform 0.15s ease !important;
      }

      .nexamos-brand-logo-link:hover {
        opacity: 0.92 !important;
        transform: translateY(-1px) !important;
      }

      .nexamos-brand-logo-img {
        height: 50px !important;
        max-height: 50px !important;
        width: auto !important;
        object-fit: contain !important;
        object-position: left center !important;
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.25)) !important;
      }

      .nexamos-sso-badge {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 3px 10px !important;
        border-radius: 9999px !important;
        background: rgba(99, 102, 241, 0.15) !important;
        border: 1px solid rgba(99, 102, 241, 0.3) !important;
        color: #818cf8 !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        letter-spacing: 0.02em !important;
      }

      .nexamos-sso-badge svg {
        width: 13px !important;
        height: 13px !important;
        flex-shrink: 0 !important;
        color: #818cf8 !important;
      }

      .nexamos-hero-title {
        margin: 0 !important;
        font-size: 20px !important;
        font-weight: 800 !important;
        color: #ffffff !important;
        letter-spacing: -0.02em !important;
        line-height: 1.25 !important;
      }

      .nexamos-hero-desc {
        margin: 0 !important;
        color: #94a3b8 !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
        max-width: 440px !important;
      }

      .nexamos-feature-grid {
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        width: 100% !important;
        max-width: 440px !important;
        margin-top: 2px !important;
      }

      .nexamos-feature-card {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 8px 12px !important;
        background: rgba(15, 23, 42, 0.65) !important;
        border: 1px solid rgba(51, 65, 85, 0.6) !important;
        border-radius: 10px !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
      }

      .nexamos-feature-icon-wrapper {
        width: 28px !important;
        height: 28px !important;
        border-radius: 6px !important;
        background: rgba(99, 102, 241, 0.15) !important;
        border: 1px solid rgba(99, 102, 241, 0.25) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
      }

      .nexamos-feature-icon {
        width: 14px !important;
        height: 14px !important;
        color: #818cf8 !important;
      }

      .nexamos-feature-title {
        font-size: 11.5px !important;
        font-weight: 600 !important;
        color: #f8fafc !important;
      }

      .nexamos-feature-sub {
        font-size: 10.5px !important;
        color: #94a3b8 !important;
        margin-top: 1px !important;
      }

      /* Kolom Kanan: Card Form & Quick Nav */
      .nexamos-col-form {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 380px !important;
        margin: 0 auto !important;
      }

      .card-pf.nexamos-auth-card {
        position: relative !important;
        width: 100% !important;
        max-width: 380px !important;
        margin: 0 !important;
        padding: 18px 20px 16px !important;
        background: var(--nexa-card-bg) !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
        border: 1px solid var(--nexa-card-border) !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04) inset !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }

      .card-pf.nexamos-auth-card::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 3px !important;
        background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%) !important;
      }

      .login-pf-header.nexamos-card-header {
        margin-bottom: 10px !important;
        padding: 0 !important;
      }

      .nexamos-card-title {
        margin: 0 0 10px !important;
        padding: 0 !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        letter-spacing: -0.015em !important;
        text-align: left !important;
      }

      #kc-content, #kc-content-wrapper, #kc-form, #kc-form-wrapper {
        margin-top: 0 !important;
        width: 100% !important;
      }

      .card-pf .form-horizontal .form-group, .card-pf .form-group {
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 10px !important;
      }

      .card-pf .col-xs-12, .card-pf .col-sm-12, .card-pf .col-md-12, .card-pf .col-lg-12, .card-pf .col-md-10 {
        padding-left: 0 !important;
        padding-right: 0 !important;
        float: none !important;
        width: 100% !important;
      }

      /* Form Fields */
      .pf-c-form__label, .pf-c-form__label-text, .card-pf label {
        display: inline-block !important;
        color: #cbd5e1 !important;
        font-size: 11.5px !important;
        font-weight: 600 !important;
        margin-bottom: 3px !important;
      }

      /* Form Registrasi (#kc-register-form): Layout 2 Kolom Kompak agar 100% Fit di Viewport PC tanpa kepotong */
      #kc-register-form {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        column-gap: 10px !important;
        row-gap: 6px !important;
        width: 100% !important;
      }

      #kc-register-form > .form-group {
        margin: 0 !important;
        grid-column: span 1 !important;
      }

      /* Baris Tombol Submit & Back to Login di Form Register span 2 kolom penuh */
      #kc-register-form > .form-group:last-of-type {
        grid-column: 1 / -1 !important;
        margin-top: 2px !important;
      }

      #kc-register-form #kc-form-options {
        margin-bottom: 6px !important;
        text-align: center !important;
      }

      #kc-register-form .pf-c-form-control,
      #kc-register-form input[type="text"],
      #kc-register-form input[type="password"],
      #kc-register-form input[type="email"] {
        height: 32px !important;
        padding: 4px 9px !important;
        font-size: 12px !important;
      }

      .card-pf.nexamos-auth-card:has(#kc-register-form) {
        max-width: 440px !important;
        padding: 14px 18px 14px !important;
      }

      .nexamos-col-form:has(#kc-register-form) {
        max-width: 440px !important;
      }

      .nexamos-col-form:has(#kc-register-form) .nexamos-col-footer {
        margin-top: 12px !important;
      }

      .card-pf.nexamos-auth-card:has(#kc-register-form) . subtitle,
      .card-pf.nexamos-auth-card:has(#kc-register-form) .subtitle {
        font-size: 10.5px !important;
        color: #94a3b8 !important;
        float: right !important;
        margin-top: 2px !important;
      }

      .pf-c-form-control, input.pf-c-form-control,
      .card-pf input[type="text"], .card-pf input[type="password"], .card-pf input[type="email"] {
        width: 100% !important;
        height: 36px !important;
        padding: 6px 10px !important;
        background-color: var(--nexa-input-bg) !important;
        border: 1px solid var(--nexa-input-border) !important;
        border-radius: 8px !important;
        color: #ffffff !important;
        font-size: 13px !important;
        font-family: inherit !important;
        line-height: 1.4 !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
      }

      .pf-c-form-control::placeholder, .card-pf input::placeholder {
        color: #64748b !important;
      }

      .pf-c-form-control:focus, .card-pf input[type="text"]:focus,
      .card-pf input[type="password"]:focus, .card-pf input[type="email"]:focus {
        outline: none !important;
        border-color: #6366f1 !important;
        background-color: #020617 !important;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25) !important;
      }

      .card-pf input:-webkit-autofill,
      .card-pf input:-webkit-autofill:hover,
      .card-pf input:-webkit-autofill:focus {
        -webkit-text-fill-color: #f8fafc !important;
        -webkit-box-shadow: 0 0 0px 1000px #020617 inset !important;
        border: 1px solid #334155 !important;
        transition: background-color 5000s ease-in-out 0s;
      }

      /* Password Toggle */
      .pf-c-input-group {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
      }

      .pf-c-input-group .pf-c-form-control,
      .pf-c-input-group input[type="password"],
      .pf-c-input-group input[type="text"] {
        padding-right: 36px !important;
      }

      .pf-c-input-group .pf-c-button.pf-m-control {
        position: absolute !important;
        right: 2px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 30px !important;
        height: 30px !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        color: #94a3b8 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 4 !important;
      }

      .pf-c-input-group .pf-c-button.pf-m-control:hover {
        color: #f8fafc !important;
      }

      /* Settings Row */
      .login-pf-settings {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin: 6px 0 10px !important;
      }

      #kc-form-options .checkbox label, .pf-c-check__label {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        color: #94a3b8 !important;
        font-size: 11.5px !important;
        cursor: pointer !important;
      }

      #kc-form-options input[type="checkbox"], .pf-c-check__input {
        width: 14px !important;
        height: 14px !important;
        margin: 0 !important;
        accent-color: #6366f1 !important;
        cursor: pointer !important;
      }

      .login-pf-settings a, #kc-form-options a, #kc-info-wrapper a, .card-pf a {
        color: #818cf8 !important;
        font-size: 11.5px !important;
        font-weight: 600 !important;
        text-decoration: none !important;
      }

      .login-pf-settings a:hover, #kc-form-options a:hover, #kc-info-wrapper a:hover, .card-pf a:hover {
        color: #a5b4fc !important;
        text-decoration: underline !important;
      }

      /* Submit Button */
      #kc-form-buttons {
        margin-top: 10px !important;
        margin-bottom: 0 !important;
      }

      #kc-login, .pf-c-button.pf-m-primary, input[type="submit"].pf-c-button.pf-m-primary {
        width: 100% !important;
        height: 38px !important;
        padding: 6px 14px !important;
        border-radius: 8px !important;
        border: none !important;
        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 52%, #c026d3 100%) !important;
        color: #ffffff !important;
        font-family: inherit !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4) !important;
        transition: transform 0.15s ease, filter 0.15s ease !important;
      }

      #kc-login:hover, .pf-c-button.pf-m-primary:hover {
        filter: brightness(1.1) !important;
        transform: translateY(-1px) !important;
      }

      /* Signup Strip */
      #kc-info.login-pf-signup {
        margin: 12px -20px -16px !important;
      }

      #kc-info-wrapper {
        padding: 8px 20px !important;
        background-color: rgba(2, 6, 23, 0.6) !important;
        border-top: 1px solid rgba(51, 65, 85, 0.6) !important;
        color: #94a3b8 !important;
        font-size: 11.5px !important;
        text-align: center !important;
      }

      /* Nav Buttons di Bawah Form */
      .nexamos-nav-under-form {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
        margin-top: 8px !important;
        width: 100% !important;
      }

      .nexamos-btn-nav {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 5px !important;
        padding: 6px 10px !important;
        border-radius: 8px !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        text-decoration: none !important;
        background: rgba(15, 23, 42, 0.8) !important;
        border: 1px solid rgba(51, 65, 85, 0.7) !important;
        color: #cbd5e1 !important;
        transition: all 0.15s ease !important;
        white-space: nowrap !important;
      }

      .nexamos-btn-nav:hover {
        background: rgba(30, 41, 59, 0.9) !important;
        border-color: #6366f1 !important;
        color: #ffffff !important;
        transform: translateY(-1px) !important;
      }

      .nexamos-btn-nav-primary {
        border-color: rgba(99, 102, 241, 0.35) !important;
        color: #a5b4fc !important;
      }

      .nexamos-btn-icon {
        width: 12px !important;
        height: 12px !important;
        flex-shrink: 0 !important;
      }

      /* Alerts */
      .pf-c-alert {
        border-radius: 8px !important;
        padding: 8px 10px !important;
        margin-bottom: 10px !important;
        font-size: 11.5px !important;
      }
      .alert-error, .pf-c-alert.pf-m-danger {
        background: rgba(244, 63, 94, 0.12) !important;
        border: 1px solid rgba(244, 63, 94, 0.32) !important;
        color: #fda4af !important;
      }
      .alert-success, .pf-c-alert.pf-m-success {
        background: rgba(16, 185, 129, 0.12) !important;
        border: 1px solid rgba(16, 185, 129, 0.32) !important;
        color: #6ee7b7 !important;
      }

      /* Footer di Kolom Kanan di Bawah Navigasi */
      .nexamos-col-footer {
        width: 100% !important;
        text-align: center !important;
        margin-top: 24px !important;
        padding-top: 4px !important;
      }

      .nexamos-footer-text {
        margin: 0 !important;
        color: #64748b !important;
        font-size: 11px !important;
        font-weight: 400 !important;
      }

      /* Responsive Breakpoint */
      @media (max-width: 860px) {
        html, html.login-pf, .login-pf body, body.nexamos-body {
          height: auto !important;
          overflow-y: auto !important;
        }
        .nexamos-page-viewport {
          height: auto !important;
          min-height: 100vh !important;
          padding: 24px 16px !important;
        }
        .nexamos-row-main {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
        }
        .nexamos-col-brand {
          align-items: center !important;
          text-align: center !important;
        }
        .nexamos-brand-wrapper {
          align-items: center !important;
        }
        .nexamos-feature-grid {
          display: none !important;
        }
        .nexamos-card-title {
          text-align: center !important;
        }
      }

      @media (max-height: 620px) {
        html, html.login-pf, .login-pf body, body.nexamos-body {
          height: auto !important;
          overflow-y: auto !important;
        }
        .nexamos-page-viewport {
          height: auto !important;
          min-height: 100vh !important;
          padding: 20px 24px !important;
        }
      }
    </style>
</head>

<body class="${properties.kcBodyClass!} nexamos-body">
  <!-- Ambient decorative glow background -->
  <div class="nexamos-bg-orbs" aria-hidden="true">
      <div class="nexamos-orb nexamos-orb-1"></div>
      <div class="nexamos-orb nexamos-orb-2"></div>
      <div class="nexamos-orb nexamos-orb-3"></div>
  </div>

  <div class="nexamos-page-viewport">
    <div class="nexamos-layout-container">
      
      <!-- ROW 1: 2 Kolom (Kolom Kiri: Branding & Keterangan, Kolom Kanan: Card Form & Tombol Navigasi) -->
      <div class="nexamos-row-main">
        
        <!-- KOLOM KIRI: Brand, Logo & Keterangan -->
        <div class="nexamos-col-brand">
          <div class="nexamos-brand-wrapper">
            <a href="https://nexamos.cloud/workspace" class="nexamos-brand-logo-link" title="NexaMOS Workspace">
              <img src="${url.resourcesPath}/img/logo-nexa-01.png" alt="NexaMOS" class="nexamos-brand-logo-img" height="50" style="height:50px;width:auto;max-height:50px;object-fit:contain;object-position:left center;display:block;margin:0;padding:0;" />
            </a>

            <div class="nexamos-sso-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" style="width:13px;height:13px;flex-shrink:0;">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>Nexa ID &middot; Single Sign-On</span>
            </div>

            <h1 class="nexamos-hero-title">
              Pusat Kendali Identitas &amp; Akses Terpadu
            </h1>
            
            <p class="nexamos-hero-desc">
              Satu sesi login aman untuk mengakses seluruh ekosistem pemasaran berbasis bukti NexaMOS tanpa perlu memasukkan kredensial berulang kali.
            </p>

            <div class="nexamos-feature-grid">
              <div class="nexamos-feature-card">
                <div class="nexamos-feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-feature-icon" width="14" height="14" style="width:14px;height:14px;">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <div>
                  <div class="nexamos-feature-title">Ekosistem Terhubung</div>
                  <div class="nexamos-feature-sub">Pusat Workspace, CRM, &amp; Web Studio langsung aktif.</div>
                </div>
              </div>

              <div class="nexamos-feature-card">
                <div class="nexamos-feature-icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-feature-icon" width="14" height="14" style="width:14px;height:14px;">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <div class="nexamos-feature-title">Keamanan Standar Industri</div>
                  <div class="nexamos-feature-sub">Didukung standar OpenID Connect &amp; PKCE terenkripsi.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- KOLOM KANAN: Card Form Keycloak & Tombol Navigasi Bawah -->
        <div class="nexamos-col-form">
          <div class="card-pf nexamos-auth-card">
            <header class="login-pf-header nexamos-card-header">
              <#if realm.internationalizationEnabled && locale.supported?size gt 1>
                <div class="${properties.kcLocaleMainClass!}" id="kc-locale">
                  <div id="kc-locale-wrapper" class="${properties.kcLocaleWrapperClass!}">
                    <div id="kc-locale-dropdown" class="menu-button-links ${properties.kcLocaleDropDownClass!}">
                      <button tabindex="1" id="kc-current-locale-link" aria-label="${msg("languages")}" aria-haspopup="true" aria-expanded="false" aria-controls="language-switch1">${locale.current}</button>
                      <ul role="menu" tabindex="-1" aria-labelledby="kc-current-locale-link" aria-activedescendant="" id="language-switch1" class="${properties.kcLocaleListClass!}">
                        <#assign i = 1>
                        <#list locale.supported as l>
                          <li class="${properties.kcLocaleListItemClass!}" role="none">
                            <a role="menuitem" id="language-${i}" class="${properties.kcLocaleItemClass!}" href="${l.url}">${l.label}</a>
                          </li>
                          <#assign i++>
                        </#list>
                      </ul>
                    </div>
                  </div>
                </div>
              </#if>

              <#if !(auth?has_content && auth.showUsername() && !auth.showResetCredentials())>
                <#if displayRequiredFields>
                  <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                      <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                    </div>
                    <div class="col-md-10">
                      <h2 id="kc-page-title" class="nexamos-card-title"><#nested "header"></h2>
                    </div>
                  </div>
                <#else>
                  <h2 id="kc-page-title" class="nexamos-card-title"><#nested "header"></h2>
                </#if>
              <#else>
                <#if displayRequiredFields>
                  <div class="${properties.kcContentWrapperClass!}">
                    <div class="${properties.kcLabelWrapperClass!} subtitle">
                      <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                    </div>
                    <div class="col-md-10">
                      <#nested "show-username">
                      <div id="kc-username" class="${properties.kcFormGroupClass!}">
                        <label id="kc-attempted-username">${auth.attemptedUsername}</label>
                        <a id="reset-login" href="${url.loginRestartFlowUrl}" aria-label="${msg("restartLoginTooltip")}">
                          <div class="kc-login-tooltip">
                            <i class="${properties.kcResetFlowIcon!}"></i>
                            <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                <#else>
                  <#nested "show-username">
                  <div id="kc-username" class="${properties.kcFormGroupClass!}">
                    <label id="kc-attempted-username">${auth.attemptedUsername}</label>
                    <a id="reset-login" href="${url.loginRestartFlowUrl}" aria-label="${msg("restartLoginTooltip")}">
                      <div class="kc-login-tooltip">
                        <i class="${properties.kcResetFlowIcon!}"></i>
                        <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
                      </div>
                    </a>
                  </div>
                </#if>
              </#if>
            </header>

            <div id="kc-content">
              <div id="kc-content-wrapper">
                <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                  <div class="alert-${message.type} ${properties.kcAlertClass!} pf-m-<#if message.type = 'error'>danger<#else>${message.type}</#if>">
                    <div class="pf-c-alert__icon">
                      <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                      <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                      <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                      <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                    </div>
                    <span class="${properties.kcAlertTitleClass!}">${kcSanitize(message.summary)?no_esc}</span>
                  </div>
                </#if>

                <#nested "form">

                <#if auth?has_content && auth.showTryAnotherWayLink()>
                  <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post">
                    <div class="${properties.kcFormGroupClass!}">
                      <input type="hidden" name="tryAnotherWay" value="on"/>
                      <a href="#" id="try-another-way" onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
                    </div>
                  </form>
                </#if>

                <#nested "socialProviders">

                <#if displayInfo>
                  <div id="kc-info" class="${properties.kcSignUpClass!}">
                    <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                      <#nested "info">
                    </div>
                  </div>
                </#if>
              </div>
            </div>
          </div>

          <!-- Tombol Navigasi Di Bawah Form -->
          <div class="nexamos-nav-under-form">
            <a href="https://nexamos.cloud/workspace" class="nexamos-btn-nav nexamos-btn-nav-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-btn-icon" width="12" height="12" style="width:12px;height:12px;">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali ke Workspace</span>
            </a>
            <a href="https://nexamos.cloud" class="nexamos-btn-nav nexamos-btn-nav-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-btn-icon" width="12" height="12" style="width:12px;height:12px;">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Beranda NexaMOS</span>
            </a>
          </div>

          <!-- Footer Copyright di Kolom Kanan dengan Jarak Agak Tinggi -->
          <footer class="nexamos-col-footer">
            <p class="nexamos-footer-text">
              &copy; 2026 NexaMOS &middot; Sistem Operasi Pemasaran Berbasis Bukti
            </p>
          </footer>
        </div>

      </div>

    </div>
  </div>
</body>
</html>
</#macro>
