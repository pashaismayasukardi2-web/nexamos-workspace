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
              <img src="${url.resourcesPath}/img/logo-nexa-01.png" alt="NexaMOS" class="nexamos-brand-logo-img" />
            </a>

            <div class="nexamos-sso-badge">
              <svg class="nexamos-sso-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-feature-icon">
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-feature-icon">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-btn-icon">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Kembali ke Workspace</span>
            </a>
            <a href="https://nexamos.cloud" class="nexamos-btn-nav nexamos-btn-nav-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nexamos-btn-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>Beranda NexaMOS</span>
            </a>
          </div>
        </div>

      </div>

      <!-- ROW 2: 1 Kolom Center Page (Footer Copyright) -->
      <footer class="nexamos-row-footer">
        <p class="nexamos-footer-text">
          &copy; 2026 NexaMOS &middot; Sistem Operasi Pemasaran Berbasis Bukti
        </p>
      </footer>

    </div>
  </div>
</body>
</html>
</#macro>
