<style>
        #env-selecter {
          background-color: #EEF1FC  !important;
          box-sizing: border-box;
                box-shadow: 0 15px 25px rgba(0,0,0,.6);
                border-radius: 10px;
               padding: 10px;
        }

        .selecter {
          margin-bottom: 10px;
          position: relative;
        }
</style>



<div class="wrapper-2">

    <img src="/images/Anees logo.png" alt="logo" class="logo" />

<div id="env-selecter">

    <div class="selecter">
        <form action="" method="POST">
            User type: 
            <% if (typeof usertype != 'undefined') { %> 
            <button class="uk-button uk-button-default uk-text-small" type="button">  <%= usertype %> 
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3.204 5L8 10.481 12.796 5H3.204zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                  </svg>
            </button>
        <% } else { %> 
            <button class="uk-button uk-button-default uk-text-small" type="button">  select your user type
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3.204 5L8 10.481 12.796 5H3.204zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                  </svg>
            </button>
        <% } %> 
            <div uk-dropdown="animation: uk-animation-slide-top-small; duration: 1000" style="color: white;">
                            <ul class="uk-nav uk-dropdown-nav">
                                 <li class="uk-active"> <a href="/users/registerTherapist"> Therapist </a> </li>
                                 <li class="uk-active"> <a  href="/usersAdmain/registerAdmain"> Admin </a> </li>
                </ul>
            </div>
        </form>
    </div>

    <% if (typeof chosen != 'undefined') { %> 
        <% if ( chosen == 'therapist_reg') { %> 
            <%- include register %> 
        <%} else if ( chosen == 'admin_reg') {  %> 
             <%- include registerAdmain %> 
        <% } else if (chosen == 'therapist_login') { %>
            <%- include login %> 
        <% } else if (chosen == 'admin_login') { %>
            <%- include loginAdmain %> 
        <% } else if ( chosen == 'nothing' ){ %> 
            <%- include hello %> 
        <% } }%> 



</div>


</div>