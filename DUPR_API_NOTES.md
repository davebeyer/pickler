# DUPR API

See DUPR "Swagger" API documentation
[here](https://backend.mydupr.com/swagger-ui/index.html) or
equivalently(?)
[here](https://api.dupr.gg/swagger-ui/index.html).

Also see Python implementation of example (unofficial) use of the API [here](https://github.com/pkshiu/duprly).


1. Login as some user to get access token

    Under Authentication: /auth/v1.0/login

    Fill in json body with email address and password

    Save "accessToken" from response

2. Get all clubs that that user can access

    Under Club: /club/v1.0/all

    Concatenate access token to "Bearer " in authorization string, e.g.,
      ```Bearer eyJhbGciOiJSUzUxMiJ9.eyJpc3MiOiJodHRwczovL2R1cHIuZ2ciLCJpYXQiOjE3Mjc1MTcwNTAsImp0aSI6IjcwMzg4MTE1MjciLCJleHAiOjE3MzAxMDkwNTAsInN1YiI6IlpHRjJaUzVpWlhsbGNrQm5iV0ZwYkM1amIyMD0ifQ.dBL8cKqE6n-Ps3u7sebFbeWxYhb88g2PbGtzj0DiV_DI7THe_CXwCTinuKGgLciXhQGGZu6XIPyDXkJrJ0GZA60VK1e3skx1B1UNzeCH0FXXu3Py805SSCoHGX-Icr-wMKew4ASJA0WogOmEjq0GmDjGs35vNLP01yPXfE0MbINOOaSnveg7sNA6joWv5DHeH1k3uvC52p_Q3tZdAy5K9GlYZRiwPdnEgc4G1deyq7RHx7FE-D3MMN6kLhCiaYZbQi-oTGn8_74eSKPxKd0LTlkjCuQhPAMEDkGyDCVJHMttl1U0gKNdRcittSvKYLcZbqtAVvj7dMR_2fMo0Voh1w``

    Fill in limit, offset (e.g., 10, 0), set Own to True (may need to toggle to False & back), set
    query string to "*" (without quotes), set version to v1.0

    Save club id(s) from response 


3. Get all club members

    Under Club: /club/<clubId>/members/v1.0/all

    Concatenate accessToken string to Bearer

    Fill in clubId and v1.0

    Sample request body:

```
{
  "exclude": [
  ],
  "filter": {
  },
  "includePendingPlayers": false,
  "includeStaff": true,
  "limit": 25,
  "offset": 0,
  "query": "*",
  "sort": {
    "order": "ASC",
    "parameter": "fullNameSort"
  }
}
```

    Can only fetch 25 at a time, so next query set offset to 25, then 50, ...

    Can get a particular person by setting query to "*Beyer*" for example.

    Comes with an ID, also a 'DUPR ID', doubles & singles ratings, age, gender, address, etc.

    Interestingly, does not include the singles or doublesReliabilityScore's

    (DUPR ID may be best to use since it's visible in the DUPR app's UI.)


4. Get Player info (including reliability scores)

    Under Players: /player/v1.0/<player ID>

    Use ID from member info above (not the DUPR ID)

