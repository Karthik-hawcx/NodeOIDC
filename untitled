



This is the deployed version of the code on the OIDC server deployed in appFunction - https://console.firebase.google.com/u/0/project/oidc-provider-hawcx/functions


Here you can see the existing OIDC provider connections to the firebase - https://console.firebase.google.com/u/0/project/hawcx-web-app-firebase/authentication/providers

This server is configured to the OIDC connection "Passwordless"


Logs for this server - use Cloud run revision filter under resource type
https://console.cloud.google.com/logs/query;query=resource.type%3D%22cloud_run_revision%22;lfeCustomFields=http_request%252Fuser_agent;cursorTimestamp=2024-12-20T05:14:18.113469Z;startTime=2024-12-19T17:22:44.803Z;endTime=2024-12-20T05:22:44.803376Z?project=oidc-provider-hawcx






Uncomment all lines in the /token flow, they were commented as the variable "code" flow requires authorize to work independently



Current Status

- /.well-known/openid-configuration - works
- /authorize - not working - gives same error, but the Values mismatch is not happening, as logs are being printed and no error is caught on the server side
- /token - works - when removed the “code variable” functionality which is retrieved after the /authorize call is done
- Testing the access_token and id_token values - working
-  /tokeninfo - works - with the id_token retrieved from /token
- /userinfo - works - when Authorization header is added with the value (“Bearer <access_token>)

Main Issues:
-/authorize endpoint not working
-login.jsx:49 Error during the popup sign-in process: Firebase: Error (auth/invalid-credential).


/.well-known/openid-configuration - output
    "issuer": "https://appfunction-lhlurqwmwa-uc.a.run.app",
    "authorization_endpoint": "https://appfunction-lhlurqwmwa-uc.a.run.app/authorize",
    "token_endpoint": "https://appfunction-lhlurqwmwa-uc.a.run.app/token",
    "jwks_uri": "https://appfunction-lhlurqwmwa-uc.a.run.app/.well-known/jwks.json"
"AIzaSyBOgzvwfO-7mhJ-eBmD5iuyahpVoJzzzzz"


/token output
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJLYXJ0aGlrIiwiYXVkIjoiQUl6YVN5Qk9nenZ3Zk8tN21oSi1lQm1ENWl1eWFocFZvSnp6enp6IiwiaWF0IjoxNzM0NjQ4MTY0LCJleHAiOjE3MzQ2NTE3NjQsInNjb3BlIjoicmVhZCB3cml0ZSJ9.ZOgw49SUmRJGqd0uhON4OzJD3z-hCRNge8YWF9HVx98",
    "token_type": "Bearer",
    "expires_in": 3600,
    "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwcGZ1bmN0aW9uLWxobHVycXdtd2EtdWMuYS5ydW4uYXBwIiwic3ViIjoiS2FydGhpayIsImF1ZCI6IkFJemFTeUJPZ3p2d2ZPLTdtaEotZUJtRDVpdXlhaHBWb0p6enp6eiIsImlhdCI6MTczNDY0ODE2NCwiZXhwIjoxNzM0NjUxNzY0LCJlbWFpbCI6IkthcnRoaWsiLCJuYW1lIjoicmszMzMzNDVAZ21haWwuY29tIn0.cOH4vPLz-EQ6G-H28nktBi3OP1mvkK28Pd8lcBOVoHI"
}

/tokeninfo output
{
    "iss": "https://appfunction-lhlurqwmwa-uc.a.run.app",
    "sub": "Karthik",
    "aud": "AIzaSyBOgzvwfO-7mhJ-eBmD5iuyahpVoJzzzzz",
    "iat": 1734648164,
    "exp": 1734651764,
    "email": "Karthik",
    "name": "rk333345@gmail.com"
}


/userinfo output
{
    "sub": "Karthik",
    "email": "Karthik",
    "name": "rk333345@gmail.com",
    "email_verified": true
}
